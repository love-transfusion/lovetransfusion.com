/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import pLimit from 'p-limit'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_comments } from '@/app/utilities/facebook/util_fb_comments'
import { util_fb_profile_picture } from '@/app/utilities/facebook/util_fb_profile_picture'
import { BANNED_KEYWORDS } from '@/app/lib/banned_keywords'
import type { Database } from '@/types/database.types'
import { supa_select_facebook_pages_pageToken } from '@/app/_actions/facebook_pages/actions'

type Admin = Awaited<ReturnType<typeof createAdmin>>
type FbPostRow = Database['public']['Tables']['facebook_posts']['Row']
type PostsSyncStatus = Database['public']['Enums']['posts_sync_status']

export const runtime = 'nodejs'
export const maxDuration = 300

const BATCH_SIZE = 10
const CONCURRENCY = 5
const PER_POST_BUDGET_MS = 20000
const RETRY_MAX = 10

// if a run is killed mid-flight, a post can remain "running" forever.
// this reaper resets those "stale running" posts to deferred.
const STALE_RUNNING_MS = 10 * 60 * 1000 // 10 minutes

const NON_EXISTENT_MARKER = 'tombstoned: non-existent/off-surface'
const STATUSES: PostsSyncStatus[] = ['idle', 'deferred', 'error']

const isAuthorizedCron = (req: NextRequest) => {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${secret}`
}

const trim = (v: unknown, max = 500) => {
  try {
    const s = typeof v === 'string' ? v : JSON.stringify(v)
    return s.length > max ? s.slice(0, max) + '…' : s
  } catch {
    return String(v)
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const jitter = (ms: number) => Math.floor(ms * (0.75 + Math.random() * 0.5))

const isRetryableHttpStatus = (status?: number) =>
  status === 429 ||
  status === 500 ||
  status === 502 ||
  status === 503 ||
  status === 504

const extractErr = (e: any) => {
  const msg: string =
    (typeof e === 'string' && e) ||
    e?.message ||
    e?.error?.message ||
    e?.response?.data?.error?.message ||
    e?.response?.data?.message ||
    ''

  const status: number | undefined =
    e?.status ||
    e?.response?.status ||
    e?.response?.data?.error?.code ||
    undefined

  const code =
    (typeof e === 'object' &&
      (e?.code ?? e?.error?.code ?? e?.response?.data?.error?.code)) ||
    undefined

  const subcode =
    (typeof e === 'object' &&
      (e?.error_subcode ??
        e?.error?.error_subcode ??
        e?.response?.data?.error?.error_subcode)) ||
    undefined

  return { msg, status, code, subcode }
}

function classifyGraphError(e: any) {
  const { msg, status, code, subcode } = extractErr(e)

  const nonExistent =
    /does not exist|cannot be loaded|unsupported get request/i.test(msg) ||
    (code === 100 && (subcode === 33 || subcode === 24))

  const permission =
    /permissions|not authorized|requires.*access|(#200)/i.test(msg) ||
    code === 200

  const retryable =
    isRetryableHttpStatus(status) ||
    /rate limit|too many calls|reduce the amount of data|temporarily unavailable/i.test(
      msg,
    )

  return { nonExistent, permission, retryable, msg, status, code, subcode }
}

/**
 * Fix for crazy historical values (e.g. retry_count = 14810).
 * Any row with retry_count >= RETRY_MAX becomes terminal (idle) with a clear last_error.
 */
async function normalizeRetryCounts(supabase: Admin, runId: string) {
  const span = (s: string) => `[CRON ${runId}] ${s}`

  const { error } = await supabase
    .from('facebook_posts')
    .update({
      sync_status: 'idle',
      last_error: `retry exhausted (>= ${RETRY_MAX})`,
      last_synced_at: new Date().toISOString(),
      next_cursor: null,
    })
    .gte('retry_count', RETRY_MAX)
    // only touch these because "idle" already terminal
    .in('sync_status', ['error', 'deferred', 'running'] as any)

  if (error) console.error(span('NORMALIZE_RETRY_ERR'), { message: error.message })
  else console.info(span('NORMALIZE_RETRY_OK'))
}

/**
 * Reap stale running posts (self-heal).
 * Requires sync_started_at column.
 */
async function reapStaleRunning(supabase: Admin, runId: string) {
  const span = (s: string) => `[CRON ${runId}] ${s}`
  const cutoff = new Date(Date.now() - STALE_RUNNING_MS).toISOString()

  const { error } = await supabase
    .from('facebook_posts')
    .update({
      sync_status: 'deferred',
      last_error: `stale running reaped (> ${Math.floor(
        STALE_RUNNING_MS / 60000,
      )}m)`,
    })
    .eq('sync_status', 'running')
    .or(`sync_started_at.is.null,sync_started_at.lt.${cutoff}`)

  if (error) console.error(span('REAP_STALE_RUNNING_ERR'), { message: error.message })
  else console.info(span('REAP_STALE_RUNNING_OK'), { cutoff })
}

export async function GET(req: NextRequest) {
  const runId = crypto.randomUUID()
  const span = (s: string) => `[CRON ${runId}] ${s}`

  console.time(span('TOTAL'))
  console.info(span('START'), {
    path: req.nextUrl?.pathname,
    query: Object.fromEntries(new URL(req.url).searchParams.entries()),
    envGraphVer: process.env.NEXT_PUBLIC_GRAPH_VERSION,
    concurrency: CONCURRENCY,
    batchSize: BATCH_SIZE,
    perPostBudgetMs: PER_POST_BUDGET_MS,
  })

  if (!isAuthorizedCron(req)) {
    console.warn(span('AUTH_FAIL'))
    console.timeEnd(span('TOTAL'))
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createAdmin()
  console.info(span('SB_READY'))

  // safety rails (run before picking)
  await normalizeRetryCounts(supabase, runId)
  await reapStaleRunning(supabase, runId)

  const { data: selectedFacebookPage } =
    await supa_select_facebook_pages_pageToken({
      clCRON: req.headers.get('authorization'),
      clFacebookPageID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
    })

  const pageToken = selectedFacebookPage?.page_token
  if (!pageToken) {
    console.timeEnd(span('TOTAL'))
    return NextResponse.json(
      { ok: false as const, runId, error: 'missing FACEBOOK_PAGE_TOKEN' },
      { status: 500 },
    )
  }

  // ---------- PICK_POSTS ----------
  console.time(span('PICK_POSTS'))
  const marker = `${NON_EXISTENT_MARKER}%`

  const { data: postsRaw, error: postsErr } = await supabase
    .from('facebook_posts')
    .select('*')
    .or(`last_error.is.null,last_error.not.ilike.${marker}`)
    .or(`retry_count.is.null,retry_count.lt.${RETRY_MAX}`)
    .in('sync_status', STATUSES)
    .order('last_synced_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)

  console.timeEnd(span('PICK_POSTS'))

  if (postsErr) {
    console.error(span('PICK_POSTS_ERR'), { message: postsErr.message })
    console.timeEnd(span('TOTAL'))
    return NextResponse.json(
      { ok: false, runId, error: postsErr.message },
      { status: 500 },
    )
  }

  const posts: FbPostRow[] = postsRaw ?? []

  console.info(span('PICK_POSTS_OK'), {
    picked: posts.length,
    postIds: posts.map((p) => p.post_id),
  })

  if (!posts.length) {
    console.info(span('NO_WORK'))
    console.timeEnd(span('TOTAL'))
    return NextResponse.json({ ok: true, runId, picked: 0, synced: 0 })
  }

  const limit = pLimit(CONCURRENCY)

  // mark running (+ timestamps so stale-running can be reaped later)
  const ids = posts.map((p) => p.post_id)
  console.time(span('MARK_RUNNING'))
  const { error: updErr } = await supabase
    .from('facebook_posts')
    .update({
      sync_status: 'running',
      last_error: null,
      sync_started_at: new Date().toISOString(),
      sync_run_id: runId,
    })
    .in('post_id', ids)
  console.timeEnd(span('MARK_RUNNING'))

  if (updErr) console.error(span('MARK_RUNNING_ERR'), { message: updErr.message })
  else console.info(span('MARK_RUNNING_OK'), { ids })

  console.time(span('PROCESS_ALL'))
  const results = await Promise.allSettled(
    posts.map((p) => limit(() => reconcilePost(supabase, p, runId, pageToken))),
  )
  console.timeEnd(span('PROCESS_ALL'))

  const synced = results.filter(
    (r) => r.status === 'fulfilled' && r.value === true,
  ).length

  const failed = results.filter(
    (r) =>
      r.status === 'rejected' ||
      (r.status === 'fulfilled' && r.value === false),
  ).length

  console.info(span('DONE'), { synced, failed, picked: posts.length })
  console.timeEnd(span('TOTAL'))

  return NextResponse.json({
    ok: true,
    runId,
    picked: posts.length,
    synced,
    failed,
  })
}

// ---------- helpers ----------

async function fetchCommentAuthorsByIds(
  commentIds: string[],
  pageAccessToken: string,
  size = 128,
  runId?: string,
  postId?: string,
  deadlineMs?: number,
): Promise<
  Record<
    string,
    { from_id: string | null; from_name: string | null; picture_url: string | null }
  >
> {
  const out: Record<
    string,
    { from_id: string | null; from_name: string | null; picture_url: string | null }
  > = {}

  const unique = Array.from(new Set(commentIds.filter(Boolean)))
  if (!unique.length) return out

  const GRAPH_VER = process.env.NEXT_PUBLIC_GRAPH_VERSION!
  const chunkSize = 50

  for (let i = 0; i < unique.length; i += chunkSize) {
    if (deadlineMs && Date.now() > deadlineMs) break

    const chunk = unique.slice(i, i + chunkSize)

    const batch = chunk.map((id) => ({
      method: 'GET',
      relative_url:
        `${encodeURIComponent(id)}?fields=` +
        encodeURIComponent(
          `from{id,name,picture.height(${size}).width(${size}){url,is_silhouette}}`,
        ),
    }))

    let attempt = 0
    const maxAttempts = 4

    while (attempt < maxAttempts) {
      if (deadlineMs && Date.now() > deadlineMs) break

      const res = await fetch(`https://graph.facebook.com/${GRAPH_VER}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: pageAccessToken, batch }),
      })

      if (!res.ok) {
        const retryable = isRetryableHttpStatus(res.status)
        if (!retryable) break
        await sleep(jitter(500 * 2 ** attempt))
        attempt++
        continue
      }

      const json = (await res.json()) as Array<{ code: number; body: string }>

      json.forEach((item, idx) => {
        try {
          const body = JSON.parse(item.body)
          if (item.code !== 200) return
          const f = body?.from
          out[chunk[idx]] = {
            from_id: f?.id ?? null,
            from_name: f?.name ?? null,
            picture_url: f?.picture?.data?.url ?? null,
          }
        } catch {}
      })

      break
    }
  }

  return out
}

async function reconcilePost(
  supabase: Admin,
  post: FbPostRow,
  runId: string,
  pageToken: string,
) {
  const postSpan = (s: string) => `[CRON ${runId}] [POST ${post.post_id}] ${s}`

  // ✅ Hard guarantee: no unexpected throw can leave the post "running"
  try {
    const startedAt = Date.now()
    const deadline = startedAt + PER_POST_BUDGET_MS

    const since = post.last_synced_at ?? undefined
    let after: string | undefined = post.next_cursor ?? undefined
    let finished = false

    const NEXT_PUBLIC_IDENTITY_ENABLED =
      (process.env.NEXT_PUBLIC_IDENTITY_ENABLED ?? 'false') === 'true'

    const canStillWork = () => Date.now() + 1500 < deadline

    const fetchCommentsWithRetry = async () => {
      let attempt = 0
      const maxAttempts = 4

      while (attempt < maxAttempts) {
        if (!canStillWork()) return { data: null, paging: null, error: 'deadline' }

        const { data, paging, error } = await util_fb_comments({
          postId: post.post_id,
          pageAccessToken: pageToken,
          order: 'chronological',
          identityEnabled: NEXT_PUBLIC_IDENTITY_ENABLED,
          ...(since ? { since } : {}),
          ...(after ? { after } : {}),
        })

        if (!error) return { data, paging, error: null }

        const { nonExistent, permission, retryable, msg, status, code, subcode } =
          classifyGraphError(error)

        console.error(postSpan('FETCH_ERR'), { msg, status, code, subcode, retryable })

        if (nonExistent || permission || !retryable) {
          return { data: null, paging: null, error }
        }

        await sleep(jitter(600 * 2 ** attempt))
        attempt++
      }

      return { data: null, paging: null, error: 'retry-exhausted' }
    }

    do {
      if (!canStillWork()) {
        console.warn(postSpan('BUDGET_EXCEEDED'), { after })
        await deferPost(supabase, post.post_id, after)
        return false
      }

      const { data, paging, error } = await fetchCommentsWithRetry()

      if (error) {
        const { nonExistent, permission } = classifyGraphError(error)

        if (error === 'deadline') {
          await deferPost(supabase, post.post_id, after)
          return false
        }

        if (nonExistent) {
          console.warn(postSpan('TOMBSTONE'), { reason: 'non-existent/off-surface' })
          const { error: tErr } = await supabase
            .from('facebook_posts')
            .update({
              sync_status: 'idle',
              next_cursor: null,
              retry_count: 0,
              last_error: NON_EXISTENT_MARKER,
              last_synced_at: new Date().toISOString(),
            })
            .eq('post_id', post.post_id)
          if (tErr) console.error(postSpan('TOMBSTONE_UPDATE_ERR'), { message: tErr.message })
          return false
        }

        if (permission) {
          await markPostError(supabase, post.post_id, 'permissions error')
          return false
        }

        await markPostError(supabase, post.post_id, `util_fb_comments error`)
        return false
      }

      if (data && data.length) {
        // avatars
        let avatarMap: Record<string, { url: string | null; isSilhouette: boolean | null }> =
          {}

        try {
          const fromIds = Array.from(
            new Set(
              data
                .map((c: any) => c.from?.id)
                .filter((x: any): x is string => !!x),
            ),
          )

          if (fromIds.length && canStillWork()) {
            let attempt = 0
            const maxAttempts = 4

            while (attempt < maxAttempts) {
              try {
                avatarMap = await util_fb_profile_picture({
                  clIDs: fromIds,
                  clAccessToken: pageToken,
                  clImageDimensions: 128,
                })
                break
              } catch (e: any) {
                const { msg, status } = extractErr(e)
                const retryable =
                  isRetryableHttpStatus(status) || /rate limit/i.test(msg)
                if (!retryable) break
                await sleep(jitter(500 * 2 ** attempt))
                attempt++
              }
            }
          }
        } catch (e: any) {
          console.error(postSpan('AVATAR_FATAL'), {
            text: trim(e?.response?.data ?? e?.message, 700),
          })
        }

        // fallback authors
        let authorFallback: Record<
          string,
          { from_id: string | null; from_name: string | null; picture_url: string | null }
        > = {}

        try {
          const needsAuthor = data
            .filter((c: any) => !(c.from?.id && c.from?.name))
            .map((c: any) => c.id)

          if (needsAuthor.length && canStillWork()) {
            authorFallback = await fetchCommentAuthorsByIds(
              needsAuthor,
              pageToken,
              128,
              runId,
              post.post_id,
              deadline,
            )
          }
        } catch (e: any) {
          console.error(postSpan('FALLBACK_ERR'), { message: e?.message })
        }

        const rows = data.map((c: any) => {
          const fromId = c.from?.id ?? authorFallback[c.id]?.from_id ?? null
          const fromName = c.from?.name ?? authorFallback[c.id]?.from_name ?? null

          const apiPic = c?.from?.picture?.data?.url ?? null
          const avatarPic = fromId ? (avatarMap[fromId]?.url ?? null) : null
          const fallbackPic = authorFallback[c.id]?.picture_url ?? null

          // avoid Date throwing
          let createdISO = new Date().toISOString()
          try {
            const rawCreated = c.created_time as any
            createdISO =
              typeof rawCreated === 'number'
                ? new Date(rawCreated * 1000).toISOString()
                : new Date(rawCreated).toISOString()
          } catch {}

          const msgLower = (c.message ?? '').toLowerCase()
          const containsBanned =
            msgLower.length > 0 && BANNED_KEYWORDS.some((w) => msgLower.includes(w))

          return {
            comment_id: c.id,
            post_id: post.post_id,
            parent_id: c.parent?.id ?? null,
            message: c.message ?? null,
            from_id: fromId,
            from_name: fromName,
            from_picture_url: apiPic ?? avatarPic ?? fallbackPic,
            created_time: createdISO,
            like_count: c.like_count ?? (c as any).like_count ?? null,
            comment_count: c.comment_count ?? (c as any).comment_count ?? null,
            permalink_url: c.permalink_url ?? (c as any).permalink_url ?? null,
            ...(containsBanned ? { is_hidden: true } : {}),
            is_deleted: false,
            raw: c as any,
            updated_at: new Date().toISOString(),
          }
        })

        const chunkSize = 500
        for (let i = 0; i < rows.length; i += chunkSize) {
          if (!canStillWork()) {
            await deferPost(supabase, post.post_id, after)
            return false
          }

          const chunk = rows.slice(i, i + chunkSize)
          const { error: upErr } = await supabase
            .from('facebook_comments')
            .upsert(chunk as any, { onConflict: 'comment_id' } as any)

          if (upErr) {
            await markPostError(
              supabase,
              post.post_id,
              `comments upsert error: ${upErr.message}`,
            )
            return false
          }
        }
      }

      const pagingAfter = (paging as any)?.cursors?.after
      after = pagingAfter

      const { error: cursorErr } = await supabase
        .from('facebook_posts')
        .update({ next_cursor: after ?? null })
        .eq('post_id', post.post_id)

      if (cursorErr) {
        console.error(postSpan('CURSOR_UPDATE_ERR'), { message: cursorErr.message })
        await deferPost(supabase, post.post_id, after)
        return false
      }

      finished = !after
    } while (!finished)

    const { error: finalizeErr } = await supabase
      .from('facebook_posts')
      .update({
        next_cursor: null,
        sync_status: 'idle',
        retry_count: 0,
        last_error: null,
        last_synced_at: new Date().toISOString(),
      })
      .eq('post_id', post.post_id)

    if (finalizeErr) {
      await markPostError(supabase, post.post_id, `finalize failed: ${finalizeErr.message}`)
      return false
    }

    return true
  } catch (e: any) {
    const { msg, status, code, subcode } = extractErr(e)
    console.error(postSpan('FATAL_THROW'), {
      msg: msg?.slice(0, 500),
      status,
      code,
      subcode,
    })
    await markPostError(supabase, post.post_id, `fatal: ${msg || 'unknown error'}`)
    return false
  }
}

async function deferPost(supabase: Admin, post_id: string, next_cursor?: string) {
  await supabase
    .from('facebook_posts')
    .update({
      sync_status: 'deferred',
      next_cursor: next_cursor ?? null,
      last_error: null,
    })
    .eq('post_id', post_id)
}

async function markPostError(supabase: Admin, post_id: string, message: string) {
  const current = await getCurrentRetry(supabase, post_id)
  const next = (current ?? 0) + 1

  await supabase
    .from('facebook_posts')
    .update({
      sync_status: next >= RETRY_MAX ? 'idle' : 'error',
      retry_count: next,
      last_error: message.slice(0, 1000),
      ...(next >= RETRY_MAX
        ? { last_synced_at: new Date().toISOString(), next_cursor: null }
        : {}),
    })
    .eq('post_id', post_id)
}

async function getCurrentRetry(supabase: Admin, post_id: string): Promise<number> {
  const { data } = await supabase
    .from('facebook_posts')
    .select('retry_count')
    .eq('post_id', post_id)
    .maybeSingle()

  return data?.retry_count ?? 0
}
