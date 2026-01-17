/* eslint-disable @typescript-eslint/no-explicit-any */

// app/test/cron-insights/page.tsx
import crypto from 'crypto'
import { headers } from 'next/headers'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fb_pageToken } from '@/app/utilities/facebook/util_fb_pageToken'
import { util_fb_shares } from '@/app/utilities/facebook/util_fb_shares'
import { util_fb_reactions_total } from '@/app/utilities/facebook/util_fb_reactions_total'
import { util_fb_reachByRegion_multiAds } from '@/app/utilities/facebook/util_fb_reachByRegion_multiAds'
import {
  supa_insert_facebook_insights,
  supa_update_facebook_insights,
} from '@/app/_actions/facebook_insights/actions'
import { merge_old_and_new_regionInsightsByDate } from '@/app/api/cron/insights/helpers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

type JobResult =
  | {
      postId: string
      userId: string | null
      status: 'skipped:cooldown' | 'ok:insert' | 'ok:update' | 'ok:shares-only'
    }
  | {
      postId: string
      userId: string | null
      status: 'error:insert' | 'error:update' | 'error:exception'
      message?: string
    }

const isAuthorizedCron = async () => {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const h = await headers()
  const auth = h.get('authorization')
  return auth === `Bearer ${secret}`
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const jitter = (ms: number) => Math.floor(ms * (0.75 + Math.random() * 0.5))

const timeExceeded = (startedMs: number, softMs = 250_000) =>
  Date.now() - startedMs >= softMs

export const createMinTimeLimiter = (minTimeMs: number) => {
  let chain = Promise.resolve()
  let last = 0

  const schedule = async <T,>(fn: () => Promise<T>) => {
    const run = chain.then(async () => {
      const now = Date.now()
      const wait = Math.max(0, minTimeMs - (now - last))
      if (wait > 0) await sleep(wait)
      last = Date.now()
      return fn()
    })

    // keep chain as Promise<void> (do not leak T into it)
    chain = run.then(
      () => undefined,
      () => undefined,
    )

    return run
  }

  return { schedule, minTimeMs }
}

const limiterLight = createMinTimeLimiter(250)
const limiterHeavy = createMinTimeLimiter(900)

// single-flight for heavy calls
const createMutex = () => {
  let lock = Promise.resolve()
  return {
    run: async <T,>(fn: () => Promise<T>) => {
      const prev = lock
      let release!: () => void
      lock = new Promise<void>((r) => (release = r))
      await prev
      try {
        return await fn()
      } finally {
        release()
      }
    },
  }
}
const heavyMutex = createMutex()

const isRateLimitError = (e: any) => {
  const status = e?.status ?? e?.response?.status ?? undefined
  const code =
    e?.code ?? e?.error?.code ?? e?.response?.data?.error?.code ?? undefined
  const subcode =
    e?.error_subcode ??
    e?.error?.error_subcode ??
    e?.response?.data?.error?.error_subcode ??
    undefined
  const msg: string =
    e?.message ??
    e?.error?.message ??
    e?.response?.data?.error?.message ??
    String(e ?? '')

  const metaThrottleCodes = code === 4 || code === 17 || code === 32
  const textThrottle =
    /rate limit|too many calls|user request limit reached|please wait/i.test(
      msg,
    )
  const http429 = status === 429

  return {
    ok: !!(http429 || metaThrottleCodes || textThrottle),
    status,
    code,
    subcode,
    msg,
  }
}

const withRetry = async <T,>(
  label: string,
  fn: () => Promise<T>,
  opts: {
    runId: string
    postId?: string
    userId?: string | null
    retries?: number
    baseDelayMs?: number
    rateLimitExtraDelayMs?: number
  },
): Promise<T> => {
  const retries = opts.retries ?? 4
  const baseDelayMs = opts.baseDelayMs ?? 800
  const rateLimitExtra = opts.rateLimitExtraDelayMs ?? 2500

  let lastErr: any = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (e: any) {
      lastErr = e
      const rl = isRateLimitError(e)
      const delay =
        jitter(baseDelayMs * 2 ** attempt) + (rl.ok ? rateLimitExtra : 0)

      console.warn(`[${label}] failed`, {
        runId: opts.runId,
        userId: opts.userId,
        postId: opts.postId,
        attempt,
        willRetry: attempt < retries,
        delay,
        rateLimited: rl.ok,
        status: rl.status,
        code: rl.code,
        subcode: rl.subcode,
        message: rl.msg?.slice?.(0, 250) ?? rl.msg,
      })

      if (attempt >= retries) break
      await sleep(delay)
    }
  }

  throw lastErr
}

const runWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  worker: (item: T, idx: number) => Promise<R>,
): Promise<R[]> => {
  const executing = new Set<Promise<any>>()
  const results: Promise<R>[] = []

  for (let i = 0; i < items.length; i++) {
    const p = Promise.resolve().then(() => worker(items[i], i))
    results.push(p)
    executing.add(p)

    const done = () => executing.delete(p)
    p.then(done).catch(done)

    if (executing.size >= limit) await Promise.race(executing)
  }

  return Promise.all(results)
}

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  // safety switch: only run when explicitly requested
  const run = '1'

  if (!run) {
    return (
      <main style={{ padding: 24, fontFamily: 'system-ui' }}>
        <h1>Test Cron: Insights Sync</h1>
        <p>
          Add <code>?run=1</code> to execute this job.
        </p>
        <p>
          Auth is still enforced via request header{' '}
          <code>authorization: Bearer CRON_SECRET</code>.
        </p>
        <p style={{ opacity: 0.7 }}>
          Tip: browsers can’t easily set custom headers. Easiest way is to call
          this route via curl/Postman hitting your site, or temporarily relax
          the auth for local testing.
        </p>
      </main>
    )
  }

  const runId = crypto.randomUUID()

//   if (!(await isAuthorizedCron())) {
//     return (
//       <main style={{ padding: 24, fontFamily: 'system-ui' }}>
//         <h1>Unauthorized</h1>
//         <p>
//           Missing/invalid <code>authorization</code> header.
//         </p>
//         <pre>
//           {JSON.stringify(
//             {
//               ok: false,
//               runId,
//               hint: 'Send: authorization: Bearer <CRON_SECRET>',
//             },
//             null,
//             2,
//           )}
//         </pre>
//       </main>
//     )
//   }

  const supabase = await createAdmin()
  const started = Date.now()

  const BATCH_SIZE = 60
  const WORKER_CONCURRENCY = 2
  const SYNC_COOLDOWN_MINUTES = 2

  const cooldownCutoffISO = new Date(
    Date.now() - SYNC_COOLDOWN_MINUTES * 60_000,
  ).toISOString()

  // Resolve page token once (for shares)
  let pageAccessToken: string | null = null
  try {
    const res = await withRetry(
      'PAGE_TOKEN',
      () =>
        limiterLight.schedule(() =>
          util_fb_pageToken({
            pageId: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
          }),
        ),
      { runId, retries: 3, baseDelayMs: 600 },
    )
    pageAccessToken = res?.data ?? null
  } catch {
    pageAccessToken = null
  }

  // 1) Pick posts to consider (cheap scan)
  const { data: posts, error: postsErr } = await supabase
    .from('facebook_posts')
    .select('post_id,user_id')
    .order('last_synced_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)

  if (postsErr) {
    const payload = {
      ok: false as const,
      runId,
      error: 'select-facebook_posts',
      details: postsErr.message,
    }
    return (
      <main style={{ padding: 24, fontFamily: 'system-ui' }}>
        <h1>Error</h1>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </main>
    )
  }

  const postIds = (posts ?? []).map((p) => p.post_id).filter(Boolean)
  if (!postIds.length) {
    const payload = {
      ok: true as const,
      runId,
      processed: 0,
      results: [] as JobResult[],
    }
    return (
      <main style={{ padding: 24, fontFamily: 'system-ui' }}>
        <h1>Done</h1>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </main>
    )
  }

  // 2) Load existing insights rows for those posts (one row per post)
  const { data: insightRows, error: insErr } = await supabase
    .from('facebook_insights')
    .select('post_id, last_synced_at, insights')
    .in('post_id', postIds)

  if (insErr) {
    const payload = {
      ok: false as const,
      runId,
      error: 'select-facebook_insights',
      details: insErr.message,
    }
    return (
      <main style={{ padding: 24, fontFamily: 'system-ui' }}>
        <h1>Error</h1>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </main>
    )
  }

  const insightMap = new Map(
    (insightRows ?? []).map((r: any) => [r.post_id, r]),
  )

  // 3) Filter by cooldown
  const candidates = (posts ?? []).filter((p) => {
    const row = insightMap.get(p.post_id)
    const last = row?.last_synced_at ?? ''
    return !last || last < cooldownCutoffISO
  })

  const worker = async (p: {
    post_id: string
    user_id: string | null
  }): Promise<JobResult> => {
    const postId = p.post_id
    const userId = p.user_id ?? null

    try {
      if (timeExceeded(started)) {
        return {
          postId,
          userId,
          status: 'error:exception',
          message: 'time-budget-exceeded',
        }
      }

      // shares + reactions (light)
      let shares = 0
      let total_reactions = 0

      if (pageAccessToken) {
        try {
          const [sharesRes, reactionsRes] = await Promise.all([
            withRetry(
              'SHARES',
              () =>
                limiterLight.schedule(() =>
                  util_fb_shares({ postID: postId, pageAccessToken }),
                ),
              { runId, postId, userId, retries: 3, baseDelayMs: 500 },
            ),
            withRetry(
              'REACTIONS',
              () =>
                limiterLight.schedule(() => util_fb_reactions_total(postId)),
              { runId, postId, userId, retries: 3, baseDelayMs: 500 },
            ),
          ])

          shares = sharesRes?.count ?? 0
          total_reactions = reactionsRes?.totalReactions ?? 0
        } catch {
          shares = 0
          total_reactions = 0
        }
      }

      const existing = insightMap.get(postId)

      const fetchHeavy = (endAnchor: 'today' | '37mon') =>
        heavyMutex.run(() =>
          withRetry(
            endAnchor === 'today' ? 'REACH_TODAY' : 'REACH_37MON',
            () =>
              limiterHeavy.schedule(() =>
                util_fb_reachByRegion_multiAds({ endAnchor, post_id: postId }),
              ),
            {
              runId,
              postId,
              userId,
              retries: 5,
              baseDelayMs: 900,
              rateLimitExtraDelayMs: 3500,
            },
          ),
        )

      if (!existing) {
        const init = await fetchHeavy('37mon')
        const { error } = await supa_insert_facebook_insights({
          user_id: userId ?? undefined,
          post_id: postId,
          insights: init,
          shares,
          total_reactions,
          last_synced_at: new Date().toISOString(),
        } as any)

        return {
          postId,
          userId,
          status: error ? 'error:insert' : 'ok:insert',
          ...(error ? { message: String(error) } : {}),
        }
      }

      const fresh = await fetchHeavy('today')
      const hasNewInsights =
        Array.isArray((fresh as any)?.days) && (fresh as any).days.length > 0

      if (hasNewInsights) {
        const merged = merge_old_and_new_regionInsightsByDate(
          existing.insights as any,
          fresh as any,
        )

        const { error } = await supa_update_facebook_insights({
          post_id: postId,
          insights: merged,
          shares,
          total_reactions,
          last_synced_at: new Date().toISOString(),
        } as any)

        return {
          postId,
          userId,
          status: error ? 'error:update' : 'ok:update',
          ...(error ? { message: String(error) } : {}),
        }
      }

      const { error } = await supa_update_facebook_insights({
        post_id: postId,
        insights: existing.insights,
        shares,
        total_reactions,
      } as any)

      return {
        postId,
        userId,
        status: error ? 'error:update' : 'ok:shares-only',
        ...(error ? { message: String(error) } : {}),
      }
    } catch (e: any) {
      return {
        postId,
        userId,
        status: 'error:exception',
        message: e?.message ?? String(e),
      }
    }
  }

  const results = await runWithConcurrency(
    candidates,
    WORKER_CONCURRENCY,
    worker,
  )

  const payload = {
    ok: true as const,
    runId,
    scanned: posts?.length ?? 0,
    candidates: candidates.length,
    processed: results.length,
    results,
    note: `Cooldown=${SYNC_COOLDOWN_MINUTES}m. Concurrency=${WORKER_CONCURRENCY}. Light=${limiterLight.minTimeMs}ms Heavy=${limiterHeavy.minTimeMs}ms (single-flight).`,
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Done</h1>
      <pre>{JSON.stringify(payload, null, 2)}</pre>
      <p style={{ marginTop: 12, opacity: 0.7 }}>
        Check server logs for rate limit / retries / timings.
      </p>
    </main>
  )
}
