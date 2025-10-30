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
import { BANNED_KEYWORDS } from '@/app/lib/banned_keywords'

export const runtime = 'nodejs'

/* ────────────────────────────────────────────────────────────────────────────
   Small utils
   ──────────────────────────────────────────────────────────────────────────── */
const chunk = <T>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )

const norm = (s?: string | null) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/** Debug-only finder to print which keyword matched. */
const findBannedHit = (
  text: string | null
): { matched: boolean; keyword?: string } => {
  const t = norm(text)
  for (const k of BANNED_KEYWORDS) {
    const kk = norm(k)
    if (!kk) continue
    // simple substring match; mirror your containsBanned behavior as close as possible
    if (t.includes(kk)) return { matched: true, keyword: k }
  }
  return { matched: false }
}

const readRaw = async (req: NextRequest) => {
  console.time('READ_RAW')
  const raw = await req.text()
  console.timeEnd('READ_RAW')
  return raw
}

const verifySignature = (req: NextRequest, raw: string) => {
  const secret = process.env.META_APP_SECRET
  if (!secret) {
    console.error('WEBHOOK: META_APP_SECRET missing')
    return process.env.NODE_ENV !== 'production'
  }
  const header = req.headers.get('x-hub-signature-256')
  if (!header?.startsWith('sha256=')) return false
  try {
    const theirs = Buffer.from(header.slice(7), 'hex')
    const ours = crypto
      .createHmac('sha256', secret)
      .update(raw, 'utf8')
      .digest()
    return theirs.length === ours.length && crypto.timingSafeEqual(theirs, ours)
  } catch (e) {
    console.error('WEBHOOK: signature verification error', e)
    return false
  }
}

const fetchGraphIsHidden = async ({
  version,
  pageAccessToken,
  ids,
}: {
  version: string
  pageAccessToken: string
  ids: string[]
}) => {
  const out: Record<string, boolean> = {}
  for (const part of chunk(ids, 50)) {
    const reqs = part.map((id) =>
      fetch(`https://graph.facebook.com/${version}/${id}?fields=is_hidden`, {
        headers: { Authorization: `Bearer ${pageAccessToken}` },
      })
        .then((r) => r.json())
        .then((j) => ({ id, is_hidden: !!j?.is_hidden }))
        .catch(() => ({ id, is_hidden: false }))
    )
    const res = await Promise.all(reqs)
    for (const r of res) out[r.id] = r.is_hidden
  }
  return out
}

const upsertPostOnce = async (
  supabase: Awaited<ReturnType<typeof createAdmin>>,
  post_id: string,
  page_id: string
) => {
  const { data: owner } = await supabase
    .from('facebook_posts')
    .select('user_id')
    .eq('post_id', post_id)
    .maybeSingle()
  const { error } = await supabase.from('facebook_posts').upsert(
    {
      post_id,
      page_id,
      ad_id: null,
      user_id: owner?.user_id ?? null,
      last_synced_at: new Date().toISOString(),
    } as any,
    { onConflict: 'post_id' }
  )
  if (error) console.error('POST_UPSERT error', { post_id, page_id, error })
}

/* ────────────────────────────────────────────────────────────────────────────
   GET: verification
   ──────────────────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  console.info('WEBHOOK[GET]: verification', {
    mode,
    hasToken: !!token,
    hasChallenge: !!challenge,
  })
  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    console.info('WEBHOOK[GET]: OK')
    return new NextResponse(challenge ?? '', { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

/* ────────────────────────────────────────────────────────────────────────────
   POST: events
   ──────────────────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  console.time('WEBHOOK_TOTAL')
  console.info('WEBHOOK[POST]: received', {
    path: req.nextUrl.pathname,
    hasSigHeader: !!req.headers.get('x-hub-signature-256'),
  })

  const supabase = await createAdmin()
  const raw = await readRaw(req)

  console.time('VERIFY_SIG')
  const ok = verifySignature(req, raw)
  console.timeEnd('VERIFY_SIG')
  if (!ok) {
    console.error('WEBHOOK: invalid signature')
    console.timeEnd('WEBHOOK_TOTAL')
    return new NextResponse('Unauthorized', { status: 401 })
  }

  console.time('PARSE_JSON')
  const body = JSON.parse(raw)
  console.timeEnd('PARSE_JSON')

  // non-blocking audit (now with timer end)
  console.time('AUDIT_INSERT')
  supabase
    .from('facebook_webhook_logs')
    .insert({ event: body })
    .then(({ error }) => error && console.error('AUDIT insert error', error))

  if (body?.object !== 'page') {
    console.info('WEBHOOK: not a page event')
    console.timeEnd('WEBHOOK_TOTAL')
    return new NextResponse('Ignored', { status: 200 })
  }

  const entries: any[] = Array.isArray(body?.entry) ? body.entry : []
  const pageIds = Array.from(new Set(entries.map((e) => e?.id).filter(Boolean)))
  console.info('WEBHOOK[POST]: parsed payload summary', {
    entriesCount: entries.length,
    distinctPageIds: pageIds.length,
    pageIds,
  })

  console.time('PAGES_QUERY')
  const { data: pages, error: pageErr } = await supabase
    .from('facebook_pages')
    .select('page_id')
    .in('page_id', pageIds)
  console.timeEnd('PAGES_QUERY')
  if (pageErr) {
    console.error('DB pages error', pageErr)
    console.timeEnd('WEBHOOK_TOTAL')
    return new NextResponse('DB error', { status: 500 })
  }
  const known = new Set((pages ?? []).map((p) => p.page_id))

  type Row = {
    page_id: string
    post_id: string
    comment_id: string
    parent_id: string | null
    message: string | null
    from_id: string | null
    from_name: string | null
    from_picture_url: string | null
    created_time: string
    updated_at: string
    like_count: number | null
    comment_count: number | null
    permalink_url: string | null
    is_edited: boolean
    is_hidden: boolean
  }

  let adds = 0,
    edits = 0,
    hides = 0,
    removes = 0

  console.time('PROCESS_ENTRIES')
  const rows: Row[] = []
  const pageToFrom = new Map<string, Set<string>>()
  const pageToCommentIds = new Map<string, Set<string>>()
  for (const entry of entries) {
    const page_id: string = entry?.id
    if (!page_id || !known.has(page_id)) continue
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

      if (v.verb === 'remove') {
        removes++
        await markCommentDeleted(supabase, {
          comment_id: v.comment_id,
          post_id: v.post_id,
          created_time_unix: v.created_time,
        })
        continue
      }
      if (v.verb === 'hide') {
        hides++
        await markCommentHidden(supabase, {
          comment_id: v.comment_id,
          post_id: v.post_id,
          created_time_unix: v.created_time,
        })
        continue
      }

      const isEdited = v.verb === 'edited'
      if (isEdited) edits++
      else adds++

      const from_id = v.from?.id ?? null
      const from_name =
        from_id && from_id === page_id
          ? 'Love Transfusion'
          : v.from?.name ?? null

      if (from_id) {
        if (!pageToFrom.has(page_id)) pageToFrom.set(page_id, new Set())
        pageToFrom.get(page_id)!.add(from_id)
      }
      if (!pageToCommentIds.has(page_id))
        pageToCommentIds.set(page_id, new Set())
      pageToCommentIds.get(page_id)!.add(v.comment_id)

      rows.push({
        page_id,
        post_id: v.post_id,
        comment_id: v.comment_id,
        parent_id: (v.parent_id as string) ?? null,
        message: (v.message as string) ?? null,
        from_id,
        from_name,
        from_picture_url: null,
        created_time: createdISO,
        updated_at: eventISO,
        like_count: (v.like_count as number) ?? null,
        comment_count: (v.comment_count as number) ?? null,
        permalink_url: (v.permalink_url as string) ?? null,
        is_edited: isEdited,
        is_hidden: false, // finalized later
      })
    }
  }
  console.timeEnd('PROCESS_ENTRIES')

  console.info('WEBHOOK[POST]: verb counts', {
    adds,
    edits,
    hides,
    removes,
    toUpsert: rows.length,
  })

  // Upsert posts once
  const seenPosts = new Set<string>()
  for (const r of rows) {
    if (seenPosts.has(r.post_id)) continue
    seenPosts.add(r.post_id)
    console.time(`POST_UPSERT_${r.page_id}_${r.post_id}`)
    await upsertPostOnce(supabase, r.post_id, r.page_id)
    console.timeEnd(`POST_UPSERT_${r.page_id}_${r.post_id}`)
  }

  // Page tokens cache + graph hidden + avatars
  const VERSION = process.env.NEXT_PUBLIC_GRAPH_VERSION!
  const systemToken = process.env.FACEBOOK_SYSTEM_TOKEN!
  const tokenCache = new Map<string, string>()
  const getPageToken = async (page_id: string) => {
    if (tokenCache.has(page_id)) return tokenCache.get(page_id)!
    const { data, error } = await util_fb_pageToken({
      pageId: page_id,
      systemToken,
    })
    if (error || !data) {
      console.error('PAGE_TOKEN failed', { page_id, error })
      return ''
    }
    tokenCache.set(page_id, data)
    return data
  }

  // Graph is_hidden per page
  console.time('GRAPH_IS_HIDDEN_LOOKUP')
  const graphIsHidden = new Map<string, boolean>() // comment_id -> bool
  for (const [page_id, idSet] of pageToCommentIds.entries()) {
    const token = await getPageToken(page_id)
    if (!token) continue
    const flags = await fetchGraphIsHidden({
      version: VERSION,
      pageAccessToken: token,
      ids: Array.from(idSet),
    })
    for (const [cid, val] of Object.entries(flags)) graphIsHidden.set(cid, val)
  }
  console.timeEnd('GRAPH_IS_HIDDEN_LOOKUP')

  // Avatars (kept for parity)
  console.time('AVATAR_ENRICHMENT')
  let filled = 0
  for (const [page_id, fromSet] of pageToFrom.entries()) {
    const token = await getPageToken(page_id)
    if (!token) continue
    const avatars = await util_fb_profile_picture({
      clIDs: Array.from(fromSet),
      clAccessToken: token,
      clImageDimensions: 128,
    })
    for (const r of rows) {
      if (r.page_id !== page_id || !r.from_id) continue
      const hit = avatars[r.from_id]
      if (hit?.url) {
        r.from_picture_url = hit.url
        filled++
      }
    }
  }
  console.info('AVATAR_ENRICHMENT', {
    pagesProcessed: pageToFrom.size,
    totalFilled: filled,
  })
  console.timeEnd('AVATAR_ENRICHMENT')

  // Finalize hidden + transition logs
  console.time('UPSERT_COMMENTS')
  let upserts = 0
  for (const part of chunk(rows, 300)) {
    const ids = part.map((p) => p.comment_id)
    const { data: existing, error: exErr } = await supabase
      .from('facebook_comments')
      .select('comment_id, is_hidden, message, updated_at')
      .in('comment_id', ids)
    if (exErr) console.error('READ existing comments failed', exErr)

    const existingMap = new Map(
      (existing ?? []).map((e) => [
        e.comment_id,
        {
          is_hidden: !!e.is_hidden,
          message: e.message ?? null,
          updated_at: e.updated_at,
        },
      ])
    )

    for (const r of part) {
      const bannedCheck = findBannedHit(r.message ?? null)
      const graphHidden = graphIsHidden.get(r.comment_id) ?? false
      const finalHidden = (bannedCheck.matched ? true : false) || graphHidden

      const prev = existingMap.get(r.comment_id)
      const prevHidden = prev?.is_hidden ?? false
      const msgChanged = (prev?.message ?? null) !== (r.message ?? null)

      if (bannedCheck.matched) {
        console.info('BANNED_DEBUG', {
          comment_id: r.comment_id,
          matched_keyword: bannedCheck.keyword,
          normalized_message: norm(r.message),
        })
      }

      if (msgChanged || prevHidden !== finalHidden || r.is_edited) {
        console.info('COMMENT_TRANSITION', {
          comment_id: r.comment_id,
          post_id: r.post_id,
          verb_edited: r.is_edited,
          prev_hidden: prevHidden,
          new_hidden: finalHidden,
          banned_match: bannedCheck.matched,
          banned_keyword: bannedCheck.keyword ?? null,
          graph_is_hidden: graphHidden,
          prev_message: prev?.message ?? null,
          new_message: r.message ?? null,
          prev_updated_at: prev?.updated_at ?? null,
          new_updated_at: r.updated_at,
        })
      }

      r.is_hidden = finalHidden
    }

    const { error: upErr } = await supabase
      .from('facebook_comments')
      .upsert(part as any, { onConflict: 'comment_id' } as any)
    if (upErr) {
      console.error('COMMENTS upsert error', {
        message: upErr.message,
        code: (upErr as any).code,
      })
    } else {
      upserts += part.length
    }
  }
  console.timeEnd('UPSERT_COMMENTS')

  console.timeEnd('WEBHOOK_TOTAL')
  return NextResponse.json({ ok: true, adds, edits, hides, removes, upserts })
}
