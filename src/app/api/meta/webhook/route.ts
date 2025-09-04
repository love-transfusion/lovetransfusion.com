/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  env_FACEBOOK_META_APP_SECRET,
  env_FACEBOOK_META_VERIFY_TOKEN,
} from '@/app/lib/facebook/constants'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import {
  markCommentDeleted,
  markCommentHidden,
} from '@/app/utilities/facebook/new/helpers/webhookWrites'

function verifySignature(req: NextRequest, rawBody: string) {
  const secret = env_FACEBOOK_META_APP_SECRET
  if (!secret) return process.env.NODE_ENV !== 'production'

  const header = req.headers.get('x-hub-signature-256')
  if (!header?.startsWith('sha256=')) return false

  const their = Buffer.from(header.slice(7), 'hex')
  const ours = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest()
  if (their.length !== ours.length) return false
  return crypto.timingSafeEqual(their, ours)
}

// GET = Verification
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === env_FACEBOOK_META_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? '', { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// POST = Events
// ... keep your imports, verifySignature, GET the same

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const supabase = await createAdmin()

  try {
    if (!verifySignature(req, raw)) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    const body = JSON.parse(raw)
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

    // page -> user mapping
    const { data: pageRows, error: pageErr } = await supabase
      .from('facebook_pages')
      .select('page_id, user_id')
      .in('page_id', pageIds)

    if (pageErr) {
      console.error('DB mapping error:', pageErr.message)
      return new NextResponse('DB mapping error', { status: 500 })
    }

    const pageToUser = new Map<string, string>()
    for (const r of pageRows ?? []) pageToUser.set(r.page_id, r.user_id)

    // Collect adds/edits, immediately apply remove/hide
    for (const entry of entries) {
      const user_id = pageToUser.get(entry.id) ?? null
      if (!user_id) {
        console.warn(
          `webhook: no user mapping for page_id=${entry.id}, skipping`
        )
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

        // Upsert the post only once per post_id within this request
        if (!touchedPosts.has(base.post_id)) {
          await supabase.from('facebook_posts').upsert(
            {
              post_id: base.post_id,
              page_id: entry.id,
              user_id,
              last_synced_at: new Date().toISOString(),
            },
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

        // add/edited → batch for one upsert
        batchedRows.push({
          ...base,
          is_hidden: false,
          is_deleted: false,
          updated_at: new Date().toISOString(),
        })
      }
    }

    // Do one (or a few) bulk upserts for all adds/edits
    if (batchedRows.length > 0) {
      const CHUNK = 500
      for (let i = 0; i < batchedRows.length; i += CHUNK) {
        const chunk = batchedRows.slice(i, i + CHUNK)
        const { error: upErr } = await supabase
          .from('facebook_comments')
          .upsert(chunk as any, { onConflict: 'comment_id' } as any)

        if (upErr) {
          console.error('batch upsert error:', upErr.message)
          // you can choose to continue or fail here; continuing is often nicer for webhooks
        }
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
