/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import pLimit from 'p-limit'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_comments } from '@/app/utilities/facebook/util_fb_comments'
import { util_fb_profile_picture } from '@/app/utilities/facebook/util_fb_profile_picture'
import { BANNED_KEYWORDS } from '@/app/lib/banned_keywords'

// ✅ adjust this import to match where your Database type is exported
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

const NON_EXISTENT_MARKER = 'tombstoned: non-existent/off-surface'

const STATUSES: PostsSyncStatus[] = ['idle', 'deferred', 'error']

const isAuthorizedCron = (req: NextRequest) => {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${secret}`
}

// --- small helpers for safe logging
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

// Pull status/message from many possible error shapes
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
    e?.response?.data?.error?.code || // sometimes "code" is not HTTP, but still useful
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

// --- classify common Graph errors so we can tombstone "gone" posts
function classifyGraphError(e: any) {
  const { msg, status, code, subcode } = extractErr(e)

  const nonExistent =
    /does not exist|cannot be loaded|unsupported get request/i.test(msg) ||
    (code === 100 && (subcode === 33 || subcode === 24))

  const permission =
    /permissions|not authorized|requires.*access|(#200)/i.test(msg) ||
    code === 200

  // retryable: rate limit / transient
  const retryable =
    isRetryableHttpStatus(status) ||
    /rate limit|too many calls|reduce the amount of data|temporarily unavailable/i.test(
      msg,
    )

  return { nonExistent, permission, retryable, msg, status, code, subcode }
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
    console.log('my req')
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createAdmin()
  console.info(span('SB_READY'))

  const { data: selectedFacebookPage } =
    await supa_select_facebook_pages_pageToken({
      clCRON: req.headers.get('authorization'),
      clFacebookPageID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
    })
  const pageToken = selectedFacebookPage?.page_token
  if (!pageToken) {
    return NextResponse.json(
      { ok: false as const, runId, error: 'missing FACEBOOK_PAGE_TOKEN' },
      { status: 500 },
    )
  }

  // ---------- PICK_POSTS (NULL-safe filters) ----------
  console.time(span('PICK_POSTS'))
  const marker = `${NON_EXISTENT_MARKER}%`

  const { data: postsRaw, error: postsErr } = await supabase
    .from('facebook_posts')
    .select('*')
    .or(`last_error.is.null,last_error.not.ilike.${marker}`)
    .or(`retry_count.is.null,retry_count.lt.${RETRY_MAX}`)
    .in('sync_status', STATUSES) // ✅ no `as any`
    .order('last_synced_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)

  console.log({ postsRaw })

  console.timeEnd(span('PICK_POSTS'))

  if (postsErr) {
    console.error(span('PICK_POSTS_ERR'), { message: postsErr.message })
    console.timeEnd(span('TOTAL'))
    return NextResponse.json(
      { ok: false, error: postsErr.message },
      { status: 500 },
    )
  }

  const posts: FbPostRow[] = postsRaw ?? [] // ✅ posts is now always an array

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

  // mark running
  const ids = posts.map((p) => p.post_id)
  console.time(span('MARK_RUNNING'))
  const { error: updErr } = await supabase
    .from('facebook_posts')
    .update({ sync_status: 'running', last_error: null })
    .in('post_id', ids)
  console.timeEnd(span('MARK_RUNNING'))

  if (updErr)
    console.error(span('MARK_RUNNING_ERR'), { message: updErr.message })
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
    (r) => r.status === 'rejected' || r.value === false,
  ).length

  console.info(span('DONE'), { synced, failed, picked: posts.length })
  console.timeEnd(span('TOTAL'))

  return NextResponse.json({
    ok: true,
    runId,
    picked: posts.length,
    synced,
  })
}

// ---------- helpers ----------

/**
 * Graph batch call for author info.
 * Adds retry/backoff on 429/5xx (important).
 */
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
    {
      from_id: string | null
      from_name: string | null
      picture_url: string | null
    }
  >
> {
  const span = (s: string) => `[CRON ${runId}] [FALLBACK ${postId}] ${s}`
  const out: Record<
    string,
    {
      from_id: string | null
      from_name: string | null
      picture_url: string | null
    }
  > = {}

  const unique = Array.from(new Set(commentIds.filter(Boolean)))
  if (!unique.length) {
    console.info(span('SKIP_EMPTY'))
    return out
  }

  const GRAPH_VER = process.env.NEXT_PUBLIC_GRAPH_VERSION!
  const chunkSize = 50

  console.info(span('START'), {
    total: unique.length,
    chunkSize,
    graphVer: GRAPH_VER,
  })

  for (let i = 0; i < unique.length; i += chunkSize) {
    if (deadlineMs && Date.now() > deadlineMs) {
      console.warn(span('DEADLINE_STOP'), { atIndex: i })
      break
    }

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
    let lastStatus: number | null = null

    while (attempt < maxAttempts) {
      if (deadlineMs && Date.now() > deadlineMs) {
        console.warn(span('DEADLINE_STOP_INNER'), { atIndex: i, attempt })
        attempt = maxAttempts
        break
      }

      console.time(span(`BATCH_${i / chunkSize}_POST_A${attempt}`))
      const res = await fetch(`https://graph.facebook.com/${GRAPH_VER}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: pageAccessToken, batch }),
      })
      console.timeEnd(span(`BATCH_${i / chunkSize}_POST_A${attempt}`))

      lastStatus = res.status

      if (!res.ok) {
        const text = await res.text()
        const retryable = isRetryableHttpStatus(res.status)
        console.warn(span('BATCH_HTTP_FAIL'), {
          status: res.status,
          retryable,
          text: text?.slice(0, 250),
        })

        if (!retryable) break

        const delay = jitter(500 * 2 ** attempt)
        await sleep(delay)
        attempt++
        continue
      }

      const json = (await res.json()) as Array<{ code: number; body: string }>
      let ok = 0
      let err = 0
      const samples: Array<{ id: string; body: any }> = []

      json.forEach((item, idx) => {
        try {
          const body = JSON.parse(item.body)
          if (samples.length < 3)
            samples.push({ id: chunk[idx], body: body?.from ?? body })
          if (item.code !== 200) {
            err++
            return
          }
          const f = body?.from
          out[chunk[idx]] = {
            from_id: f?.id ?? null,
            from_name: f?.name ?? null,
            picture_url: f?.picture?.data?.url ?? null,
          }
          ok++
        } catch {
          err++
        }
      })

      console.info(span('BATCH_RESULT'), { index: i / chunkSize, ok, err })
      if (samples.length) {
        console.info(
          span('BATCH_SAMPLE_BODIES'),
          samples.map((s) => ({ id: s.id, body: trim(s.body, 400) })),
        )
      }

      attempt = maxAttempts
      break
    }

    if (lastStatus && isRetryableHttpStatus(lastStatus)) {
      console.info(span('BATCH_STATUS_END'), { status: lastStatus })
    }
  }

  console.info(span('END'), { resolved: Object.keys(out).length })
  return out
}

async function reconcilePost(
  supabase: Admin,
  post: FbPostRow, // ✅ use typed row from Supabase
  runId: string,
  pageToken: string,
) {
  const postSpan = (s: string) => `[CRON ${runId}] [POST ${post.post_id}] ${s}`

  const startedAt = Date.now()
  const deadline = startedAt + PER_POST_BUDGET_MS

  console.info(postSpan('BEGIN'), {
    page_id: post.page_id,
    since: post.last_synced_at,
    prevCursor: post.next_cursor,
    budgetMs: PER_POST_BUDGET_MS,
  })

  // 0) Resolve page token (IMPORTANT: pass systemToken if available)
  console.time(postSpan('PAGE_TOKEN'))

  const since = post.last_synced_at ?? undefined
  let after: string | undefined = post.next_cursor ?? undefined
  let finished = false

  const NEXT_PUBLIC_IDENTITY_ENABLED =
    (process.env.NEXT_PUBLIC_IDENTITY_ENABLED ?? 'false') === 'true'

  const canStillWork = () => Date.now() + 1500 < deadline // leave buffer

  // small retry wrapper for util_fb_comments
  const fetchCommentsWithRetry = async () => {
    let attempt = 0
    const maxAttempts = 4

    while (attempt < maxAttempts) {
      if (!canStillWork())
        return { data: null, paging: null, error: 'deadline' }

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

      console.error(postSpan('FETCH_ERR'), {
        msg,
        status,
        code,
        subcode,
        retryable,
      })

      if (nonExistent || permission || !retryable) {
        return { data: null, paging: null, error }
      }

      const delay = jitter(600 * 2 ** attempt)
      console.warn(postSpan('FETCH_RETRY'), { attempt, delay })
      await sleep(delay)
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

    console.time(postSpan('FETCH_COMMENTS'))
    const { data, paging, error } = await fetchCommentsWithRetry()
    console.timeEnd(postSpan('FETCH_COMMENTS'))

    if (error) {
      const { nonExistent, permission } = classifyGraphError(error)

      if (error === 'deadline') {
        await deferPost(supabase, post.post_id, after)
        return false
      }

      if (nonExistent) {
        console.warn(postSpan('TOMBSTONE'), {
          reason: 'non-existent/off-surface',
        })
        await supabase
          .from('facebook_posts')
          .update({
            sync_status: 'idle',
            next_cursor: null,
            retry_count: 0,
            last_error: NON_EXISTENT_MARKER,
            last_synced_at: new Date().toISOString(),
          })
          .eq('post_id', post.post_id)
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
      // ---- avatars (wrap with retry)
      let avatarMap: Record<
        string,
        { url: string | null; isSilhouette: boolean | null }
      > = {}

      try {
        const fromIds = Array.from(
          new Set(
            data
              .map((c: any) => c.from?.id)
              .filter((x: any): x is string => !!x),
          ),
        )

        console.info(postSpan('AVATAR_IDS'), { uniqueFromIds: fromIds.length })

        if (fromIds.length && canStillWork()) {
          let attempt = 0
          const maxAttempts = 4

          while (attempt < maxAttempts) {
            try {
              console.time(postSpan(`AVATAR_ENRICH_A${attempt}`))
              avatarMap = await util_fb_profile_picture({
                clIDs: fromIds,
                clAccessToken: pageToken,
                clImageDimensions: 128,
              })
              console.timeEnd(postSpan(`AVATAR_ENRICH_A${attempt}`))
              console.info(postSpan('AVATAR_DONE'), {
                resolved: Object.keys(avatarMap).length,
              })
              break
            } catch (e: any) {
              const { msg, status } = extractErr(e)
              const retryable =
                isRetryableHttpStatus(status) || /rate limit/i.test(msg)
              console.error(postSpan('AVATAR_FAIL'), {
                status,
                retryable,
                msg: msg?.slice(0, 200),
              })
              if (!retryable) break
              const delay = jitter(500 * 2 ** attempt)
              await sleep(delay)
              attempt++
            }
          }
        }
      } catch (e: any) {
        console.error(postSpan('AVATAR_FATAL'), {
          text: trim(e?.response?.data ?? e?.message, 700),
        })
      }

      // ---- fallback author fetch (batched + retry, deadline-aware)
      let authorFallback: Record<
        string,
        {
          from_id: string | null
          from_name: string | null
          picture_url: string | null
        }
      > = {}

      try {
        const needsAuthor = data
          .filter((c: any) => !(c.from?.id && c.from?.name))
          .map((c: any) => c.id)

        console.info(postSpan('FALLBACK_NEED'), { count: needsAuthor.length })

        if (needsAuthor.length && canStillWork()) {
          authorFallback = await fetchCommentAuthorsByIds(
            needsAuthor,
            pageToken,
            128,
            runId,
            post.post_id,
            deadline,
          )
          const resolvedNames = Object.values(authorFallback).filter(
            (v) => !!v.from_name,
          ).length
          console.info(postSpan('FALLBACK_DONE'), {
            resolved: Object.keys(authorFallback).length,
            resolvedNames,
          })
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

        const rawCreated = c.created_time as any
        const createdISO =
          typeof rawCreated === 'number'
            ? new Date(rawCreated * 1000).toISOString()
            : new Date(rawCreated).toISOString()

        const msgLower = (c.message ?? '').toLowerCase()
        const containsBanned =
          msgLower.length > 0 &&
          BANNED_KEYWORDS.some((w) => msgLower.includes(w))

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

      // Upsert
      const chunkSize = 500
      console.time(postSpan('UPSERT'))

      for (let i = 0; i < rows.length; i += chunkSize) {
        if (!canStillWork()) {
          console.warn(postSpan('UPSERT_DEADLINE_DEFER'), {
            atChunk: i / chunkSize,
          })
          await deferPost(supabase, post.post_id, after)
          console.timeEnd(postSpan('UPSERT'))
          return false
        }

        const chunk = rows.slice(i, i + chunkSize)
        console.info(postSpan('UPSERT_CHUNK'), {
          index: i / chunkSize,
          size: chunk.length,
        })

        const { error: upErr } = await supabase
          .from('facebook_comments')
          .upsert(chunk as any, { onConflict: 'comment_id' } as any)

        if (upErr) {
          console.error(postSpan('UPSERT_ERR'), {
            message: upErr.message,
            index: i / chunkSize,
            size: chunk.length,
          })
          await markPostError(
            supabase,
            post.post_id,
            `comments upsert error: ${upErr.message}`,
          )
          console.timeEnd(postSpan('UPSERT'))
          return false
        }
      }

      console.timeEnd(postSpan('UPSERT'))
      console.info(postSpan('UPSERT_OK'), { total: rows.length })
    } else {
      console.info(postSpan('NO_DATA_PAGE'))
    }

    const pagingAfter = (paging as any)?.cursors?.after
    after = pagingAfter
    console.info(postSpan('CURSOR_UPDATE'), { next_after: after ?? null })

    await supabase
      .from('facebook_posts')
      .update({ next_cursor: after ?? null })
      .eq('post_id', post.post_id)

    finished = !after
  } while (!finished)

  console.time(postSpan('FINALIZE'))
  const { error: updErr } = await supabase
    .from('facebook_posts')
    .update({
      next_cursor: null,
      sync_status: 'idle',
      retry_count: 0,
      last_error: null,
      last_synced_at: new Date().toISOString(),
    })
    .eq('post_id', post.post_id)
  console.timeEnd(postSpan('FINALIZE'))

  if (updErr) {
    console.error(postSpan('FINALIZE_ERR'), { message: updErr.message })
    await markPostError(
      supabase,
      post.post_id,
      `last_synced_at update failed: ${updErr.message}`,
    )
    return false
  }

  console.info(postSpan('END_OK'))
  return true
}

async function deferPost(
  supabase: Admin,
  post_id: string,
  next_cursor?: string,
) {
  console.warn(`[DEFER ${post_id}]`, { next_cursor: next_cursor ?? null })
  await supabase
    .from('facebook_posts')
    .update({
      sync_status: 'deferred',
      next_cursor: next_cursor ?? null,
      last_error: null,
    })
    .eq('post_id', post_id)
}

async function markPostError(
  supabase: Admin,
  post_id: string,
  message: string,
) {
  const current = await getCurrentRetry(supabase, post_id)
  const next = (current ?? 0) + 1

  await supabase
    .from('facebook_posts')
    .update({
      sync_status: next >= RETRY_MAX ? 'idle' : 'error',
      retry_count: next,
      last_error: message.slice(0, 1000),
      ...(next >= RETRY_MAX
        ? { last_synced_at: new Date().toISOString() }
        : {}),
    })
    .eq('post_id', post_id)
}

async function getCurrentRetry(
  supabase: Admin,
  post_id: string,
): Promise<number> {
  const { data } = await supabase
    .from('facebook_posts')
    .select('retry_count')
    .eq('post_id', post_id)
    .maybeSingle()

  return data?.retry_count ?? 0
}
