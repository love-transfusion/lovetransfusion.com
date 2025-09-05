/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import {
  markCommentDeleted,
  markCommentHidden,
} from '@/app/utilities/facebook/new/helpers/webhookWrites'

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

  if (
    mode === 'subscribe' &&
    token === process.env.META_WEBHOOK_VERIFY_TOKEN!
  ) {
    return new NextResponse(challenge ?? '', { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// POST = Events
export async function POST(req: NextRequest) {
  const raw = await req.text()
  const supabase = await createAdmin()

  try {
    if (!verifySignature(req, raw)) {
      console.error('WEBHOOK: signature check failed', {
        hasHeader: !!req.headers.get('x-hub-signature-256'),
        envHasSecret: !!process.env.META_APP_SECRET, // ← correct var
        nodeEnv: process.env.NODE_ENV,
      })
      return new NextResponse('Invalid signature', { status: 401 })
    }
    const body = JSON.parse(raw)

    // Audit log
    await supabase.from('facebook_webhook_logs').insert({ event: body })

    if (body?.object !== 'page')
      return new NextResponse('Ignored', { status: 200 })

    const touchedPosts = new Set<string>()
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

    // page -> connected_by_user_id mapping (for RLS/audit if needed)
    const { data: pageRows, error: pageErr } = await supabase
      .from('facebook_pages')
      .select('page_id, connected_by_user_id') // fixed columns
      .in('page_id', pageIds)

    if (pageErr) {
      console.error('DB mapping error:', pageErr.message)
      return new NextResponse('DB mapping error', { status: 500 })
    }

    const pageToConnector = new Map<string, string>()
    for (const r of pageRows ?? [])
      pageToConnector.set(r.page_id, r.connected_by_user_id)

    // Collect adds/edits; apply remove/hide immediately
    for (const entry of entries) {
      const page_id: string = entry.id
      if (!pageToConnector.has(page_id)) {
        console.warn(`webhook: no page row for page_id=${page_id}, skipping`)
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
        if (!touchedPosts.has(base.post_id)) {
          const ownerUserId = await resolveOwnerUserIdForPost(
            supabase,
            base.post_id
          )

          await supabase.from('facebook_posts').upsert(
            {
              post_id: base.post_id,
              page_id, // entry.id
              ad_id: null, // or inferred if you have it
              user_id: ownerUserId, // ← stays your current column name
              last_synced_at: new Date().toISOString(),
            } as any,
            { onConflict: 'post_id' }
          )

          touchedPosts.add(base.post_id)
        }

        // Handle verbs
        if (v.verb === 'remove') {
          await markCommentDeleted(supabase, {
            comment_id: base.comment_id,
            post_id: base.post_id,
            created_time_unix: v.created_time,
          })
          continue
        }
        if (v.verb === 'hide') {
          await markCommentHidden(supabase, {
            comment_id: base.comment_id,
            post_id: base.post_id,
            created_time_unix: v.created_time,
          })
          continue
        }

        // add/edited → batch
        batchedRows.push({
          ...base,
          is_hidden: false,
          is_deleted: false,
          updated_at: new Date().toISOString(),
        })
      }
    }

    // Bulk upsert comments
    if (batchedRows.length > 0) {
      const CHUNK = 500
      for (let i = 0; i < batchedRows.length; i += CHUNK) {
        const chunk = batchedRows.slice(i, i + CHUNK)
        const { error: upErr } = await supabase
          .from('facebook_comments')
          .upsert(chunk as any, { onConflict: 'comment_id' } as any)
        if (upErr) console.error('batch upsert error:', upErr.message)
      }
    }

    return NextResponse.json({
      ok: true,
      added_or_edited: batchedRows.length,
      touched_posts: touchedPosts.size,
    })
  } catch (e: any) {
    console.error('webhook error', e?.message, e)
    return new NextResponse('Bad Request', { status: 400 })
  }
}
