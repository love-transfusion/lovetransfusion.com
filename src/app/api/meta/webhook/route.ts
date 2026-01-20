/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import {
  markCommentDeleted,
  markCommentHidden,
} from '@/app/utilities/facebook/helpers/webhookWrites'

import { util_fb_profile_picture } from '@/app/utilities/facebook/util_fb_profile_picture'
import { util_fb_pageToken } from '@/app/utilities/facebook/util_fb_pageToken'
import { BANNED_KEYWORDS, containsBanned } from '@/app/lib/banned_keywords'
import { metaFetchJson } from './metaFetch'

export const runtime = 'nodejs'

// ─────────────────────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────────────────────
function verifySignature(req: NextRequest, rawBody: string) {
  const secret = process.env.META_APP_SECRET
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
    if (!ok) console.error(`WEBHOOK: bad signature, header is: ${header}`)
    return ok
  } catch (e) {
    console.error('WEBHOOK: signature verification threw', e)
    return false
  }
}

// Debug-only normalization + best-effort matched keyword finder
const dbgNormalize = (s?: string | null) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const dbgFindFirstMatch = (text: string | null, list: string[]) => {
  const t = dbgNormalize(text)
  for (const k of list) {
    const kk = dbgNormalize(k)
    if (!kk) continue
    if (t.includes(kk)) return k
  }
  return null
}

const chunkArr = <T>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  )

/**
 * Batch-check is_hidden for up to 50 comment IDs in one HTTP request.
 */
const graphBatchIsHidden = async (args: {
  version: string
  pageAccessToken: string
  commentIds: string[]
}) => {
  const { version, pageAccessToken, commentIds } = args
  const ids = Array.from(new Set(commentIds.filter(Boolean))).slice(0, 50)
  if (!ids.length) return [] as Array<{ cid: string; is_hidden: boolean }>

  const batch = ids.map((cid) => ({
    method: 'GET',
    // ✅ IMPORTANT: do NOT encode the whole id/path; Graph batch expects path-like strings
    relative_url: `${cid}?fields=is_hidden`,
  }))

  const url = `https://graph.facebook.com/${version}/`
  const { ok, status, data, text } = await metaFetchJson<
    Array<{ code: number; body: string }>
  >({
    url,
    label: 'HIDDEN_FLAG_BATCH',
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: pageAccessToken, batch }),
    },
    retries: 4,
    baseDelayMs: 500,
  })

  if (!ok || !Array.isArray(data)) {
    console.error('HIDDEN_FLAG_BATCH failed', {
      status,
      text: text?.slice(0, 300),
    })
    return ids.map((cid) => ({ cid, is_hidden: false }))
  }

  return data.map((item, idx) => {
    const cid = ids[idx]
    try {
      if (item.code !== 200) return { cid, is_hidden: false }
      const body = JSON.parse(item.body)
      return { cid, is_hidden: !!body?.is_hidden }
    } catch {
      return { cid, is_hidden: false }
    }
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// GET = Verification
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  console.info('WEBHOOK[GET]: verification request', {
    mode,
    hasToken: !!token,
    hasChallenge: !!challenge,
  })

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    console.info('WEBHOOK[GET]: verification OK')
    return new NextResponse(challenge ?? '', { status: 200 })
  }

  console.warn('WEBHOOK[GET]: verification FAILED', { mode })
  return new NextResponse('Forbidden', { status: 403 })
}

// ─────────────────────────────────────────────────────────────────────────────
// POST = Events
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  console.time('WEBHOOK_TOTAL')
  console.info('WEBHOOK[POST]: received', {
    path: req.nextUrl.pathname,
    hasSigHeader: !!req.headers.get('x-hub-signature-256'),
  })

  const raw = await req.text()
  const supabase = await createAdmin()

  try {
    const sigOk = verifySignature(req, raw)
    if (!sigOk) {
      console.error('WEBHOOK: signature check failed', {
        hasHeader: !!req.headers.get('x-hub-signature-256'),
        envHasSecret: !!process.env.META_APP_SECRET,
        nodeEnv: process.env.NODE_ENV,
      })
      console.timeEnd('WEBHOOK_TOTAL')
      return new NextResponse('Invalid signature', { status: 401 })
    }

    const body = JSON.parse(raw)

    // Audit log (don’t fail webhook on audit failure)
    const { error: logErr } = await supabase
      .from('facebook_webhook_logs')
      .insert({ event: body })
    if (logErr) {
      console.error('WEBHOOK: audit insert error', { message: logErr.message })
    }

    if (body?.object !== 'page') {
      console.info('WEBHOOK[POST]: non-page object, ignored', {
        object: body?.object,
      })
      console.timeEnd('WEBHOOK_TOTAL')
      return new NextResponse('Ignored', { status: 200 })
    }

    const touchedPosts = new Set<string>()
    const failedPosts = new Set<string>()

    const batchedRows: Array<{
      comment_id: string
      post_id: string
      parent_id: string | null
      message: string | null
      from_id: string | null
      from_name: string | null
      from_picture_url: string | null
      created_time?: string
      like_count: number | null
      comment_count: number | null
      permalink_url: string | null
      is_edited: boolean
      raw: any
      updated_at: string
      is_hidden: boolean
    }> = []

    const pageToFromIds = new Map<string, Set<string>>() // page_id -> from_ids
    const commentToPage = new Map<string, string>() // comment_id -> page_id
    const pageToCommentIds = new Map<string, Set<string>>() // page_id -> comment_ids

    const entries = Array.isArray(body?.entry) ? body.entry : []
    const pageIds: string[] = Array.from(
      new Set(
        entries
          .map((e: any) => e?.id)
          .filter(
            (id: unknown): id is string =>
              typeof id === 'string' && id.length > 0,
          ),
      ),
    )

    // Map page_id -> connector (skip unknown pages)
    const { data: pageRows, error: pageErr } = await supabase
      .from('facebook_pages')
      .select('page_id, connected_by_user_id')
      .in('page_id', pageIds)

    if (pageErr) {
      console.error('DB mapping error:', { message: pageErr.message })
      console.timeEnd('WEBHOOK_TOTAL')
      return new NextResponse('DB mapping error', { status: 500 })
    }

    const knownPages = new Set((pageRows ?? []).map((r) => r.page_id))

    let adds = 0,
      edits = 0,
      hides = 0,
      removes = 0

    // Collect adds/edits; apply remove/hide immediately
    for (const entry of entries) {
      const page_id: string = entry.id
      if (!knownPages.has(page_id)) continue

      const changes = entry?.changes ?? []
      for (const ch of changes) {
        if (ch.field !== 'feed') continue
        const v = ch.value
        if (v.item !== 'comment') continue

        const createdISO = v.created_time
          ? new Date(v.created_time * 1000).toISOString()
          : new Date().toISOString()

        const eventISO =
          typeof entry?.time === 'number'
            ? new Date(entry.time * 1000).toISOString()
            : createdISO

        const realFromId = v.from?.id ?? null
        const isPageComment = realFromId === page_id
        const realFromName = isPageComment
          ? 'Love Transfusion'
          : (v.from?.name ?? null)

        const base = {
          comment_id: v.comment_id as string,
          post_id: v.post_id as string,
          parent_id: (v.parent_id as string) ?? null,
          message: (v.message as string) ?? null,
          from_id: realFromId,
          from_name: realFromName,
          from_picture_url: null as string | null,
          created_time: createdISO,
          like_count: (v.like_count as number) ?? null,
          comment_count: (v.comment_count as number) ?? null,
          permalink_url: (v.permalink_url as string) ?? null,
          raw: v ?? {},
        }

        if (base.from_id) {
          if (!pageToFromIds.has(page_id)) pageToFromIds.set(page_id, new Set())
          pageToFromIds.get(page_id)!.add(base.from_id)
        }

        commentToPage.set(base.comment_id, page_id)
        if (!pageToCommentIds.has(page_id))
          pageToCommentIds.set(page_id, new Set())
        pageToCommentIds.get(page_id)!.add(base.comment_id)

        // ✅ SAFER post upsert:
        // - don’t fetch ownerUserId per request
        // - don’t overwrite user_id with null
        if (!touchedPosts.has(base.post_id) && !failedPosts.has(base.post_id)) {
          const { error: postUpErr } = await supabase
            .from('facebook_posts')
            .upsert(
              {
                post_id: base.post_id,
                page_id,
                ad_id: null,
                // do NOT set user_id here; keep existing
                last_synced_at: new Date().toISOString(),
              } as any,
              { onConflict: 'post_id' },
            )

          if (postUpErr) {
            console.error('WEBHOOK[POST]: facebook_posts upsert FAILED', {
              post_id: base.post_id,
              page_id,
              message: postUpErr.message,
            })
            failedPosts.add(base.post_id)
          } else {
            touchedPosts.add(base.post_id)
          }
        }

        if (failedPosts.has(base.post_id)) continue

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

        const isEdited = v.verb === 'edited'
        if (isEdited) edits++
        else adds++

        const willBeHidden = containsBanned(base.message ?? '', BANNED_KEYWORDS)

        if (willBeHidden) {
          const hit = dbgFindFirstMatch(base.message ?? null, BANNED_KEYWORDS)
          console.info('BANNED_DEBUG', {
            comment_id: base.comment_id,
            matched_keyword: hit,
            normalized_message: dbgNormalize(base.message),
          })
        }

        batchedRows.push({
          ...base,
          is_edited: isEdited,
          updated_at: isEdited ? eventISO : createdISO,
          is_hidden: willBeHidden,
        })
      }
    }

    console.info('WEBHOOK[POST]: verb counts', {
      adds,
      edits,
      hides,
      removes,
      toUpsert: batchedRows.length,
    })

    // Avatar enrichment
    if (batchedRows.length > 0 && pageToFromIds.size > 0) {
      try {
        for (const [page_id, fromSet] of pageToFromIds.entries()) {
          const fromIds = Array.from(fromSet)
          if (!fromIds.length) continue

          const systemToken = process.env.FACEBOOK_SYSTEM_TOKEN
          if (!systemToken) continue

          const { data: pageAccessToken } = await util_fb_pageToken({
            pageId: page_id,
            systemToken,
          })

          if (!pageAccessToken) continue

          const avatars = await util_fb_profile_picture({
            clIDs: fromIds,
            clAccessToken: pageAccessToken,
            clImageDimensions: 128,
          })

          for (const row of batchedRows) {
            if (!row.from_id) continue
            const rowPage = commentToPage.get(row.comment_id)
            if (rowPage !== page_id) continue
            const hit = avatars[row.from_id]
            if (hit?.url) row.from_picture_url = hit.url
          }
        }
      } catch (e: any) {
        console.error('WEBHOOK[POST]: avatar enrichment failed', {
          message: e?.message,
        })
      }
    }

    // Bulk upsert
    if (batchedRows.length > 0) {
      const CHUNK = 500
      for (let i = 0; i < batchedRows.length; i += CHUNK) {
        const chunk = batchedRows.slice(i, i + CHUNK)
        const { error: upErr } = await supabase
          .from('facebook_comments')
          .upsert(chunk as any, { onConflict: 'comment_id' } as any)

        if (upErr) {
          console.error('WEBHOOK[POST]: batch upsert error', {
            message: upErr.message,
          })
        }
      }
    }

    // Hidden-flag sync (batched + safe)
    // Guard: don’t do this if there are too many IDs (webhook should be fast)
    const MAX_HIDDEN_SYNC_IDS_PER_PAGE = 500

    if (pageToCommentIds.size > 0) {
      for (const [page_id, idSet] of pageToCommentIds.entries()) {
        const commentIds = Array.from(idSet)
        if (!commentIds.length) continue

        if (commentIds.length > MAX_HIDDEN_SYNC_IDS_PER_PAGE) {
          console.warn('HIDDEN_FLAG_SYNC: skipped (too many ids)', {
            page_id,
            count: commentIds.length,
          })
          continue
        }

        const systemToken = process.env.FACEBOOK_SYSTEM_TOKEN
        if (!systemToken) continue

        const { data: pageAccessToken } = await util_fb_pageToken({
          pageId: page_id,
          systemToken,
        })
        if (!pageAccessToken) continue

        const VERSION = process.env.NEXT_PUBLIC_GRAPH_VERSION!
        const hiddenToMark: string[] = []

        for (const group of chunkArr(commentIds, 50)) {
          const results = await graphBatchIsHidden({
            version: VERSION,
            pageAccessToken,
            commentIds: group,
          })
          for (const r of results) if (r.is_hidden) hiddenToMark.push(r.cid)
        }

        if (!hiddenToMark.length) continue

        // Only set is_hidden:true if DB currently believes it's hidden (still hidden locally).
        const { data: existing } = await supabase
          .from('facebook_comments')
          .select('comment_id, is_hidden')
          .in('comment_id', hiddenToMark)

        const locallyHidden = new Set(
          (existing ?? [])
            .filter((e) => e.is_hidden === true)
            .map((e) => e.comment_id),
        )

        const toUpdate = hiddenToMark.filter((id) => locallyHidden.has(id))
        if (toUpdate.length) {
          await supabase
            .from('facebook_comments')
            .update({ is_hidden: true })
            .in('comment_id', toUpdate)
        }
      }
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
