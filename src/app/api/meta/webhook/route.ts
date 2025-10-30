/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import {
  markCommentDeleted,
  markCommentHidden,
} from '@/app/utilities/facebook/helpers/webhookWrites'

// ✅ ADDED: use your profile-picture util
import { util_fb_profile_picture } from '@/app/utilities/facebook/util_fb_profile_picture'
import { util_fb_pageToken } from '@/app/utilities/facebook/util_fb_pageToken'
import { BANNED_KEYWORDS } from '@/app/lib/banned_keywords'

// Ensure Node runtime (you are using 'crypto')
export const runtime = 'nodejs'

// ---- helpers you own elsewhere ----
async function resolveOwnerUserIdForPost(
  supabase: Awaited<ReturnType<typeof createAdmin>>,
  postId: string
): Promise<string | null> {
  const { data: existing } = await supabase
    .from('facebook_posts')
    .select('user_id') // ← use your actual column
    .eq('post_id', postId)
    .maybeSingle()

  return existing?.user_id ?? null
}

function verifySignature(req: NextRequest, rawBody: string) {
  const secret = process.env.META_APP_SECRET!
  if (!secret) {
    console.error('WEBHOOK: APP_SECRET missing in env (META_APP_SECRET)')
    return process.env.NODE_ENV !== 'production'
  }

  const header = req.headers.get('x-hub-signature-256')
  if (!header?.startsWith('sha256=')) {
    console.error('WEBHOOK: missing/invalid x-hub-signature-256 header')
    return false
  }

  try {
    const their = Buffer.from(header.slice(7), 'hex')
    const ours = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest()
    if (their.length !== ours.length) {
      console.error('WEBHOOK: HMAC length mismatch')
      return false
    }
    const ok = crypto.timingSafeEqual(their, ours)
    if (!ok)
      console.error(
        `WEBHOOK: timingSafeEqual failed (bad signature), header is: ${header}`
      )
    return ok
  } catch (e) {
    console.error('WEBHOOK: signature verification threw', e)
    return false
  }
}

// GET = Verification
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  // Loud, structured logs at each gate
  console.info('WEBHOOK[GET]: verification request', {
    mode,
    hasToken: !!token,
    hasChallenge: !!challenge,
  })

  if (
    mode === 'subscribe' &&
    token === process.env.META_WEBHOOK_VERIFY_TOKEN!
  ) {
    console.info('WEBHOOK[GET]: verification OK')
    return new NextResponse(challenge ?? '', { status: 200 })
  }
  console.warn('WEBHOOK[GET]: verification FAILED', { mode, tokenOk: false })
  return new NextResponse('Forbidden', { status: 403 })
}

// POST = Events
export async function POST(req: NextRequest) {
  console.time('WEBHOOK_TOTAL')
  console.info('WEBHOOK[POST]: received', {
    path: req.nextUrl.pathname,
    hasSigHeader: !!req.headers.get('x-hub-signature-256'),
  })

  // Use req.text() ONCE for HMAC; then JSON.parse(raw)
  console.time('READ_RAW')
  const raw = await req.text()
  console.timeEnd('READ_RAW')

  const supabase = await createAdmin()

  try {
    console.time('VERIFY_SIG')
    const sigOk = verifySignature(req, raw)
    console.timeEnd('VERIFY_SIG')

    if (!sigOk) {
      console.error('WEBHOOK: signature check failed', {
        hasHeader: !!req.headers.get('x-hub-signature-256'),
        envHasSecret: !!process.env.META_APP_SECRET, // ← correct var
        nodeEnv: process.env.NODE_ENV,
      })
      console.timeEnd('WEBHOOK_TOTAL')
      return new NextResponse('Invalid signature', { status: 401 })
    }

    console.time('PARSE_JSON')
    const body = JSON.parse(raw)
    console.timeEnd('PARSE_JSON')

    // Audit log
    console.time('AUDIT_INSERT')
    const { error: logErr } = await supabase
      .from('facebook_webhook_logs')
      .insert({ event: body })
    console.timeEnd('AUDIT_INSERT')
    if (logErr) {
      console.error('WEBHOOK: audit insert error', {
        message: logErr.message,
        details: (logErr as any).details,
        hint: (logErr as any).hint,
        code: (logErr as any).code,
      })
    }

    if (body?.object !== 'page') {
      console.info('WEBHOOK[POST]: non-page object, ignored', {
        object: body?.object,
      })
      console.timeEnd('WEBHOOK_TOTAL')
      return new NextResponse('Ignored', { status: 200 })
    }

    const touchedPosts = new Set<string>()
    const failedPosts = new Set<string>() // if post upsert fails, skip its comments
    const batchedRows: Array<{
      comment_id: string
      post_id: string
      parent_id: string | null
      message: string | null
      from_id: string | null
      from_name: string | null
      from_picture_url: string | null
      created_time?: string // keep this
      like_count: number | null
      comment_count: number | null
      permalink_url: string | null
      is_edited: boolean
      raw: any
      updated_at: string // keep this
    }> = []

    // ✅ ADDED (local maps for avatar enrichment by page)
    const pageToFromIds = new Map<string, Set<string>>() // page_id -> set(from_id)
    const commentToPage = new Map<string, string>() // comment_id -> page_id
    const pageToCommentIds = new Map<string, Set<string>>()
    const commentIdToMsgLower = new Map<string, string>()

    const entries = Array.isArray(body?.entry) ? body.entry : []
    const pageIds: string[] = Array.from(
      new Set(
        entries
          .map((e: any) => e?.id)
          .filter(
            (id: unknown): id is string =>
              typeof id === 'string' && id.length > 0
          )
      )
    )

    console.info('WEBHOOK[POST]: parsed payload summary', {
      entriesCount: entries.length,
      distinctPageIds: pageIds.length,
      pageIds,
    })

    // page -> connected_by_user_id mapping (for RLS/audit if needed)
    console.time('PAGES_QUERY')
    const { data: pageRows, error: pageErr } = await supabase
      .from('facebook_pages')
      .select('page_id, connected_by_user_id') // fixed columns
      .in('page_id', pageIds)
    console.timeEnd('PAGES_QUERY')

    if (pageErr) {
      console.error('DB mapping error:', {
        message: pageErr.message,
        details: (pageErr as any).details,
        hint: (pageErr as any).hint,
        code: (pageErr as any).code,
      })
      console.timeEnd('WEBHOOK_TOTAL')
      return new NextResponse('DB mapping error', { status: 500 })
    }

    const pageToConnector = new Map<string, string>()
    for (const r of pageRows ?? [])
      pageToConnector.set(r.page_id, r.connected_by_user_id)

    let adds = 0,
      edits = 0,
      hides = 0,
      removes = 0

    console.time('PROCESS_ENTRIES')
    // Collect adds/edits; apply remove/hide immediately
    for (const entry of entries) {
      const page_id: string = entry.id
      if (!pageToConnector.has(page_id)) {
        console.warn('WEBHOOK[POST]: unknown page_id; skipping changes', {
          page_id,
        })
        continue
      }

      const changes = entry?.changes ?? []
      for (const ch of changes) {
        if (ch.field !== 'feed') continue
        const v = ch.value
        if (v.item !== 'comment') continue

        const createdISO = v.created_time
          ? new Date(v.created_time * 1000).toISOString()
          : new Date().toISOString()

        // For edits, Facebook webhook gives the event time at entry.time (unix seconds).
        const eventISO =
          typeof entry?.time === 'number'
            ? new Date(entry.time * 1000).toISOString()
            : createdISO

        const realFromId = v.from?.id ?? null
        const isPageComment = realFromId === page_id
        const realFromName = isPageComment
          ? 'Love Transfusion' // or keep v.from?.name for flexibility
          : v.from?.name ?? null

        const base = {
          comment_id: v.comment_id as string,
          post_id: v.post_id as string,
          parent_id: (v.parent_id as string) ?? null,
          message: (v.message as string) ?? null,
          from_id: realFromId,
          from_name: realFromName,
          from_picture_url: null as string | null, // will be enriched below
          created_time: createdISO,
          like_count: (v.like_count as number) ?? null,
          comment_count: (v.comment_count as number) ?? null,
          permalink_url: (v.permalink_url as string) ?? null,
          raw: v ?? {},
        }

        if (v.verb === 'edited' && !v.message) {
          // Try to fetch current message for edits missing message field
          try {
            const version = process.env.NEXT_PUBLIC_GRAPH_VERSION!
            const tokenRes = await util_fb_pageToken({
              pageId: page_id,
              systemToken: process.env.FACEBOOK_SYSTEM_TOKEN!,
            })
            const token = tokenRes.data
            if (token) {
              const resp = await fetch(
                `https://graph.facebook.com/${version}/${v.comment_id}?fields=message`,
                { headers: { Authorization: `Bearer ${token}` } }
              )
              const json = await resp.json()
              if (json?.message)
                commentIdToMsgLower.set(
                  v.comment_id,
                  json.message.toLowerCase()
                )
            }
          } catch (e: any) {
            console.warn('EDIT_FETCH_FAIL', v.comment_id, e?.message)
          }
        }

        const msgLower = (base.message ?? '').toLowerCase()
        if (msgLower) commentIdToMsgLower.set(base.comment_id, msgLower)

        // ✅ AUTO-HIDE FILTER for banned words/phrases
        // ✅ AUTO-HIDE FILTER for banned words/phrases
        if (base.message) {
          const containsBanned = BANNED_KEYWORDS.some((word) =>
            msgLower.includes(word)
          )
          if (containsBanned) {
            console.info('Filtered comment auto-hidden (keyword match)', {
              comment_id: base.comment_id,
              matched: true,
            })

            await supabase.from('facebook_comments').upsert(
              {
                comment_id: base.comment_id,
                post_id: base.post_id,
                message: base.message,
                is_hidden: true,
                raw: v,
                updated_at: new Date().toISOString(),
              } as any,
              { onConflict: 'comment_id' }
            )

            continue
          }
        }

        // Track from_ids by page for later avatar enrichment
        if (base.from_id) {
          if (!pageToFromIds.has(page_id)) pageToFromIds.set(page_id, new Set())
          pageToFromIds.get(page_id)!.add(base.from_id)
        }
        // Map this comment to its page
        commentToPage.set(base.comment_id, page_id)

        if (!pageToCommentIds.has(page_id))
          pageToCommentIds.set(page_id, new Set())
        pageToCommentIds.get(page_id)!.add(base.comment_id)

        // Ensure the post exists/updated once per request
        if (!touchedPosts.has(base.post_id) && !failedPosts.has(base.post_id)) {
          console.time(`POST_UPSERT_${base.post_id}`)
          const ownerUserId = await resolveOwnerUserIdForPost(
            supabase,
            base.post_id
          )

          const { error: postUpErr } = await supabase
            .from('facebook_posts')
            .upsert(
              {
                post_id: base.post_id,
                page_id, // entry.id
                ad_id: null, // or inferred if you have it
                user_id: ownerUserId, // ← stays your current column name
                last_synced_at: new Date().toISOString(),
              } as any,
              { onConflict: 'post_id' }
            )
          console.timeEnd(`POST_UPSERT_${base.post_id}`)

          if (postUpErr) {
            // Log full error and mark this post as failed so we don't insert comments (FK protection)
            console.error('WEBHOOK[POST]: facebook_posts upsert FAILED', {
              post_id: base.post_id,
              page_id,
              message: postUpErr.message,
              details: (postUpErr as any).details,
              hint: (postUpErr as any).hint,
              code: (postUpErr as any).code,
            })
            failedPosts.add(base.post_id)
          } else {
            touchedPosts.add(base.post_id)
          }
        }

        // If the post upsert failed, skip processing comments for that post
        if (failedPosts.has(base.post_id)) {
          console.warn(
            'WEBHOOK[POST]: skipping comments due to post upsert failure',
            {
              post_id: base.post_id,
            }
          )
          continue
        }

        // Handle verbs
        if (v.verb === 'remove') {
          removes++
          await markCommentDeleted(supabase, {
            comment_id: base.comment_id,
            post_id: base.post_id,
            created_time_unix: v.created_time,
          })
          continue
        }
        if (v.verb === 'hide') {
          hides++
          await markCommentHidden(supabase, {
            comment_id: base.comment_id,
            post_id: base.post_id,
            created_time_unix: v.created_time,
          })
          continue
        }

        // add/edited → batch
        // (Meta sends 'edited' explicitly; otherwise treat as add/new)
        const isEdited = v.verb === 'edited' // NEW
        if (isEdited) edits++
        else adds++

        const rowWithCreated = {
          ...base,
          created_time: createdISO,
          is_edited: isEdited,
          updated_at: isEdited ? eventISO : createdISO,
        }

        batchedRows.push(rowWithCreated)
      }
    }
    console.timeEnd('PROCESS_ENTRIES')

    console.info('WEBHOOK[POST]: verb counts', {
      adds,
      edits,
      hides,
      removes,
      toUpsert: batchedRows.length,
      touchedPosts: touchedPosts.size,
      failedPosts: failedPosts.size,
    })

    // ✅ ADDED: Avatar enrichment using PAGE ACCESS TOKENS (before bulk upsert)
    if (batchedRows.length > 0 && pageToFromIds.size > 0) {
      try {
        console.time('AVATAR_ENRICHMENT')
        let totalFilled = 0
        for (const [page_id, fromSet] of pageToFromIds.entries()) {
          const fromIds = Array.from(fromSet)
          if (!fromIds.length) continue

          // Get a PAGE ACCESS TOKEN for this page
          const systemToken = process.env.FACEBOOK_SYSTEM_TOKEN!
          let pageAccessToken: string | null = null
          try {
            const { data } = await util_fb_pageToken({
              pageId: page_id,
              systemToken,
            })
            pageAccessToken = data
          } catch (e: any) {
            console.error('WEBHOOK[POST]: util_fb_pageToken failed', {
              page_id,
              message: e?.message,
            })
            continue
          }
          if (!pageAccessToken) {
            console.warn('WEBHOOK[POST]: no page access token resolved', {
              page_id,
            })
            continue
          }

          // Fetch avatars for this page’s commenters
          const avatars = await util_fb_profile_picture({
            clIDs: fromIds,
            clAccessToken: pageAccessToken,
            clImageDimensions: 128, // adjust if you want larger
          })

          // Apply to rows that belong to this page
          for (const row of batchedRows) {
            if (!row.from_id) continue
            const rowPage = commentToPage.get(row.comment_id)
            if (rowPage !== page_id) continue
            const hit = avatars[row.from_id]
            if (hit?.url) {
              row.from_picture_url = hit.url
              totalFilled++
            }
          }
        }
        console.timeEnd('AVATAR_ENRICHMENT')
        console.info('WEBHOOK[POST]: avatar enrichment done', {
          pagesProcessed: pageToFromIds.size,
          totalFilled,
        })
      } catch (e: any) {
        console.error('WEBHOOK[POST]: avatar enrichment failed', {
          message: e?.message,
        })
      }
    }

    // Bulk upsert comments
    if (batchedRows.length > 0) {
      console.time('COMMENTS_BULK_UPSERT')
      const CHUNK = 500
      for (let i = 0; i < batchedRows.length; i += CHUNK) {
        const chunk = batchedRows.slice(i, i + CHUNK)
        const { error: upErr } = await supabase
          .from('facebook_comments')
          .upsert(chunk as any, { onConflict: 'comment_id' } as any)
        if (upErr) {
          console.error('WEBHOOK[POST]: batch upsert error', {
            message: upErr.message,
            details: (upErr as any).details,
            hint: (upErr as any).hint,
            code: (upErr as any).code,
            batchSize: chunk.length,
          })
        }
      }
      console.timeEnd('COMMENTS_BULK_UPSERT')
    }

    // ===== NEW: Hidden-flag sync for auto-moderated comments =====
    // ===== NEW: Hidden-flag sync for auto-moderated comments (with unhide on edits) =====
    if (pageToCommentIds.size > 0) {
      console.time('HIDDEN_FLAG_SYNC')
      let totalHidden = 0
      let totalUnhidden = 0

      const chunkArr = <T>(arr: T[], size: number) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
          arr.slice(i * size, i * size + size)
        )

      for (const [page_id, idSet] of pageToCommentIds.entries()) {
        const commentIds = Array.from(idSet)
        if (!commentIds.length) continue

        // Resolve a PAGE ACCESS TOKEN
        let pageAccessToken: string | null = null
        try {
          const { data } = await util_fb_pageToken({
            pageId: page_id,
            systemToken: process.env.FACEBOOK_SYSTEM_TOKEN!,
          })
          pageAccessToken = data
        } catch (e: any) {
          console.error('HIDDEN_FLAG_SYNC: page token error', {
            page_id,
            message: e?.message,
          })
        }
        if (!pageAccessToken) continue

        const VERSION = process.env.NEXT_PUBLIC_GRAPH_VERSION!
        const hiddenToMark: string[] = []
        const unhideToMark: string[] = []

        for (const group of chunkArr(commentIds, 50)) {
          const requests = group.map((cid) =>
            fetch(
              `https://graph.facebook.com/${VERSION}/${cid}?fields=is_hidden`,
              {
                headers: { Authorization: `Bearer ${pageAccessToken}` },
              }
            )
              .then((r) => r.json())
              .then((j) => ({ cid, is_hidden: !!j?.is_hidden }))
              .catch((e) => ({ cid, is_hidden: false, err: e }))
          )

          const results = await Promise.all(requests)
          for (const r of results) {
            const latestMsgLower = commentIdToMsgLower.get(r.cid) ?? ''
            const containsBanned = latestMsgLower
              ? BANNED_KEYWORDS.some((w) => latestMsgLower.includes(w))
              : false

            if (r.is_hidden || containsBanned) {
              hiddenToMark.push(r.cid)
            } else {
              // Not hidden by FB and no banned terms → unhide locally
              unhideToMark.push(r.cid)
            }
          }
        }

        if (hiddenToMark.length) {
          totalHidden += hiddenToMark.length
          const { error: upErr } = await supabase
            .from('facebook_comments')
            .update({ is_hidden: true })
            .in('comment_id', hiddenToMark)
          if (upErr) {
            console.error('HIDDEN_FLAG_SYNC: update failed (hide)', {
              page_id,
              count: hiddenToMark.length,
              message: upErr.message,
              details: (upErr as any).details,
              hint: (upErr as any).hint,
              code: (upErr as any).code,
            })
          }
        }

        if (unhideToMark.length) {
          totalUnhidden += unhideToMark.length
          const { error: upErr2 } = await supabase
            .from('facebook_comments')
            .update({ is_hidden: false })
            .in('comment_id', unhideToMark)
          if (upErr2) {
            console.error('HIDDEN_FLAG_SYNC: update failed (unhide)', {
              page_id,
              count: unhideToMark.length,
              message: upErr2.message,
              details: (upErr2 as any).details,
              hint: (upErr2 as any).hint,
              code: (upErr2 as any).code,
            })
          }
        }
      }

      console.timeEnd('HIDDEN_FLAG_SYNC')
      console.info('HIDDEN_FLAG_SYNC: done', { totalHidden, totalUnhidden })
    }

    console.timeEnd('WEBHOOK_TOTAL')
    return NextResponse.json({
      ok: true,
      added_or_edited: batchedRows.length,
      touched_posts: touchedPosts.size,
      failed_posts: failedPosts.size,
    })
  } catch (e: any) {
    console.error('webhook error', e?.message, e)
    console.timeEnd('WEBHOOK_TOTAL')
    return new NextResponse('Bad Request', { status: 400 })
  }
}
