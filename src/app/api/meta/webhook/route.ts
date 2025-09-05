/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import {
  markCommentDeleted,
  markCommentHidden,
} from '@/app/utilities/facebook/new/helpers/webhookWrites'

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
      created_time: string
      like_count: number | null
      comment_count: number | null
      permalink_url: string | null
      is_hidden: boolean
      is_deleted: boolean
      raw: any
      updated_at: string
    }> = []

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

        const base = {
          comment_id: v.comment_id as string,
          post_id: v.post_id as string,
          parent_id: (v.parent_id as string) ?? null,
          message: (v.message as string) ?? null,
          from_id: v.from?.id ?? null,
          from_name: v.from?.name ?? null,
          from_picture_url: null as string | null,
          created_time: v.created_time
            ? new Date(v.created_time * 1000).toISOString()
            : new Date().toISOString(),
          like_count: (v.like_count as number) ?? null,
          comment_count: (v.comment_count as number) ?? null,
          permalink_url: (v.permalink_url as string) ?? null,
          raw: v ?? {},
        }

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
        if (v.verb === 'edited') edits++
        else adds++

        batchedRows.push({
          ...base,
          is_hidden: false,
          is_deleted: false,
          updated_at: new Date().toISOString(),
        })
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
