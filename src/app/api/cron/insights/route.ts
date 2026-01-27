/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
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
      status:
        | 'skipped:cooldown'
        | 'ok:insert'
        | 'ok:update'
        | 'ok:shares-only'
        | 'ok:shares-reactions-only'
      reactions_supported?: boolean
      reactions_error?: string
      total_reactions?: number
      shares?: number
    }
  | {
      postId: string
      userId: string | null
      status: 'error:insert' | 'error:update' | 'error:exception'
      message?: string
    }

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  return (
    !!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`
  )
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const jitter = (ms: number) => Math.floor(ms * (0.75 + Math.random() * 0.5))

const timeExceeded = (startedMs: number, softMs = 250_000) =>
  Date.now() - startedMs >= softMs

// NOTE: keep this local (NOT exported) to avoid "Server Actions must be async"
const createMinTimeLimiter = (minTimeMs: number) => {
  let chain: Promise<unknown> = Promise.resolve()
  let last = 0

  const schedule = async <T>(fn: () => Promise<T>): Promise<T> => {
    const run = chain.then(async () => {
      const now = Date.now()
      const wait = Math.max(0, minTimeMs - (now - last))
      if (wait > 0) await sleep(wait)
      last = Date.now()
      return fn()
    })

    chain = run.catch(() => {})
    return run as Promise<T>
  }

  return { schedule, minTimeMs }
}

const limiterLight = createMinTimeLimiter(250)
const limiterHeavy = createMinTimeLimiter(900)

// single-flight for heavy calls
const createMutex = () => {
  let lock: Promise<void> = Promise.resolve()
  return {
    run: async <T>(fn: () => Promise<T>) => {
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

const extractMetaErr = (e: any) => {
  const status = e?.status ?? e?.response?.status ?? e?.error?.status
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

  return { status, code, subcode, msg }
}

// For util_fb_reactions_total "returned error object"
const isReactionUnsupported = (err: any) => {
  const msg = String(err?.message ?? '')
  const code = err?.code
  const subcode = err?.error_subcode

  return (
    (code === 100 && subcode === 33) ||
    /Unsupported get request/i.test(msg) ||
    /does not exist|cannot be loaded|missing permissions|does not support this operation/i.test(
      msg,
    )
  )
}

const isAdsAccountRateLimited = (e: any) => {
  const { code, subcode, msg } = extractMetaErr(e)
  // your screenshot shows code 80004, subcode 2446079
  return (
    code === 80004 ||
    subcode === 2446079 ||
    /too many calls to this ad-account/i.test(msg ?? '')
  )
}

const isRateLimitError = (e: any) => {
  const { status, code, subcode, msg } = extractMetaErr(e)

  const metaThrottleCodes = code === 4 || code === 17 || code === 32
  const textThrottle =
    /rate limit|too many calls|user request limit reached|please wait|too many calls/i.test(
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

const withRetry = async <T>(
  label: string,
  fn: () => Promise<T>,
  opts: {
    runId: string
    postId?: string
    userId?: string | null
    retries?: number
    baseDelayMs?: number
    rateLimitExtraDelayMs?: number
    nonRetryable?: (e: any) => boolean
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

      if (opts.nonRetryable?.(e)) {
        console.warn(`[${label}] non-retryable`, {
          runId: opts.runId,
          userId: opts.userId,
          postId: opts.postId,
          attempt,
          message: extractMetaErr(e).msg?.slice(0, 250),
        })
        throw e
      }

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

export const GET = async (req: NextRequest) => {
  const runId = crypto.randomUUID()
  const url = new URL(req.url)
  const mode = url.searchParams.get('mode') // "light" | null
  const LIGHT_ONLY = mode === 'light'

  if (!isAuthorizedCron(req))
    return new NextResponse('Unauthorized', { status: 401 })

  const supabase = await createAdmin()
  const started = Date.now()

  const BATCH_SIZE = 60
  const WORKER_CONCURRENCY = 2
  const SYNC_COOLDOWN_MINUTES = 2

  const cooldownCutoffISO = new Date(
    Date.now() - SYNC_COOLDOWN_MINUTES * 60_000,
  ).toISOString()

  // ✅ env guard (cron-proof)
  const pageAccessToken = process.env.FACEBOOK_PAGE_TOKEN
  if (!pageAccessToken) {
    return NextResponse.json(
      { ok: false as const, runId, error: 'missing FACEBOOK_PAGE_TOKEN' },
      { status: 500 },
    )
  }

  // Global flag: once ads endpoint is rate-limited, skip all remaining heavy calls in this run
  let adsThrottledThisRun = false

  // 1) Pick posts to consider (cheap scan)
  const { data: posts, error: postsErr } = await supabase
    .from('facebook_posts')
    .select('post_id,user_id,reactions_supported,reactions_checked_at')
    // you can keep this .not(...) or remove it; either way we handle nulls safely below
    .not('user_id', 'is', null)
    .order('reactions_checked_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)

  if (postsErr) {
    return NextResponse.json(
      {
        ok: false as const,
        runId,
        error: 'select-facebook_posts',
        details: postsErr.message,
      },
      { status: 500 },
    )
  }

  const postIds = (posts ?? []).map((p) => p.post_id).filter(Boolean)
  if (!postIds.length) {
    return NextResponse.json({
      ok: true as const,
      runId,
      processed: 0,
      results: [] as JobResult[],
    })
  }

  // 2) Load existing insights rows for those posts (one row per post)
  const { data: insightRows, error: insErr } = await supabase
    .from('facebook_insights')
    .select('post_id, last_synced_at, insights')
    .in('post_id', postIds)

  if (insErr) {
    return NextResponse.json(
      {
        ok: false as const,
        runId,
        error: 'select-facebook_insights',
        details: insErr.message,
      },
      { status: 500 },
    )
  }

  const insightMap = new Map(
    (insightRows ?? []).map((r: any) => [r.post_id, r]),
  )

  const hasUserId = <T extends { user_id: string | null }>(
    p: T,
  ): p is T & { user_id: string } => !!p.user_id

  // ✅ IMPORTANT: compute "eligible" first so "skipped" stays accurate
  const eligible = (posts ?? []).filter(hasUserId)

  // 3) Split by cooldown (accurate)
  const candidates = eligible.filter((p) => {
    const row = insightMap.get(p.post_id)
    const last = row?.last_synced_at ?? ''
    return !last || last < cooldownCutoffISO
  })

  const skipped = eligible
    .filter((p) => !candidates.some((c) => c.post_id === p.post_id))
    .map(
      (p): JobResult => ({
        postId: p.post_id,
        userId: p.user_id,
        status: 'skipped:cooldown',
      }),
    )

  const worker = async (p: {
    post_id: string
    user_id: string
    reactions_supported: boolean | null
    reactions_checked_at: string | null
  }): Promise<JobResult> => {
    const postId = p.post_id
    const userId = p.user_id

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
      let reactions_supported = true
      let reactions_error: string | undefined = undefined

      // 1) Shares (retry ok)
      const sharesRes = await withRetry(
        'SHARES',
        () =>
          limiterLight.schedule(() =>
            util_fb_shares({ postID: postId, pageAccessToken }),
          ),
        { runId, postId, userId, retries: 3, baseDelayMs: 500 },
      )
      shares = sharesRes?.count ?? 0

      // 2) Reactions (best-effort, NO retry, and cache unsupported in DB)
      const knownUnsupported = p.reactions_supported === false
      if (knownUnsupported) {
        reactions_supported = false
        total_reactions = 0
      } else {
        const reactionsRes = await limiterLight.schedule(() =>
          util_fb_reactions_total({ postId, pageAccessToken }),
        )

        if (reactionsRes?.error) {
          if (isReactionUnsupported(reactionsRes.error)) {
            reactions_supported = false
            total_reactions = 0

            console.warn('[REACTIONS] unsupported/best-effort', {
              runId,
              postId,
              userId,
              message: reactionsRes.error.message?.slice(0, 250),
              status: reactionsRes.error.status,
              code: reactionsRes.error.code,
              subcode: reactionsRes.error.error_subcode,
            })

            await supabase
              .from('facebook_posts')
              .update({
                reactions_supported: false,
                reactions_checked_at: new Date().toISOString(),
              })
              .eq('post_id', postId)
          } else {
            reactions_supported = true // unknown, not proven unsupported
            total_reactions = 0
            reactions_error = String(reactionsRes.error.message ?? 'unknown')

            console.warn('[REACTIONS] error/best-effort', {
              runId,
              postId,
              userId,
              message: reactionsRes.error.message?.slice(0, 250),
              status: reactionsRes.error.status,
              code: reactionsRes.error.code,
              subcode: reactionsRes.error.error_subcode,
            })
          }
        } else {
          total_reactions = reactionsRes.data.totalReactions
          reactions_supported = true

          await supabase
            .from('facebook_posts')
            .update({
              reactions_supported: true,
              reactions_checked_at: new Date().toISOString(),
            })
            .eq('post_id', postId)
        }
      }

      const existing = insightMap.get(postId)

      const fetchHeavy = async (endAnchor: 'today' | '37mon') => {
        if (LIGHT_ONLY) throw new Error('light-mode-skip-heavy')
        if (adsThrottledThisRun) throw new Error('ads-throttled-skip-heavy')

        try {
          return await heavyMutex.run(() =>
            withRetry(
              endAnchor === 'today' ? 'REACH_TODAY' : 'REACH_37MON',
              () =>
                limiterHeavy.schedule(() =>
                  util_fb_reachByRegion_multiAds({
                    endAnchor,
                    post_id: postId,
                  }),
                ),
              {
                runId,
                postId,
                userId,
                retries: 5,
                baseDelayMs: 900,
                rateLimitExtraDelayMs: 3500,
                // ✅ KEY FIX: don't spam-retry ads-account throttle
                nonRetryable: (e) => isAdsAccountRateLimited(e),
              },
            ),
          )
        } catch (e: any) {
          if (isAdsAccountRateLimited(e)) {
            adsThrottledThisRun = true
            console.warn(
              '[ADS_THROTTLE] detected - skipping remaining heavy calls this run',
              {
                runId,
                postId,
                userId,
                message: extractMetaErr(e).msg?.slice(0, 250),
              },
            )
          }
          throw e
        }
      }

      // Insert path
      if (!existing) {
        try {
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
            reactions_supported,
            ...(reactions_error ? { reactions_error } : {}),
            total_reactions,
            shares,
          }
        } catch (e: any) {
          const msg = extractMetaErr(e).msg ?? String(e)
          const isThrottled =
            adsThrottledThisRun ||
            String(e?.message).includes('ads-throttled-skip-heavy')

          if (isThrottled) {
            const placeholderInsights = {
              days: [],
              meta: {
                skippedHeavy: true,
                reason: 'ads-throttled',
                runId,
                at: new Date().toISOString(),
              },
            }

            const { error } = await supa_insert_facebook_insights({
              user_id: userId ?? undefined,
              post_id: postId,
              insights: placeholderInsights,
              shares,
              total_reactions,
              last_synced_at: new Date().toISOString(),
            } as any)

            return {
              postId,
              userId,
              status: error ? 'error:insert' : 'ok:shares-reactions-only',
              ...(error ? { message: String(error) } : {}),
              reactions_supported,
              ...(reactions_error ? { reactions_error } : {}),
              total_reactions,
              shares,
            }
          }

          return { postId, userId, status: 'error:insert', message: msg }
        }
      }

      // Update path
      try {
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
            reactions_supported,
            ...(reactions_error ? { reactions_error } : {}),
            total_reactions,
            shares,
          }
        }

        // No new heavy insights. Still update shares/reactions.
        const { error } = await supa_update_facebook_insights({
          post_id: postId,
          insights: existing.insights,
          shares,
          total_reactions,
          last_synced_at: new Date().toISOString(),
        } as any)

        return {
          postId,
          userId,
          status: error ? 'error:update' : 'ok:shares-only',
          ...(error ? { message: String(error) } : {}),
          reactions_supported,
          ...(reactions_error ? { reactions_error } : {}),
          total_reactions,
          shares,
        }
      } catch (e: any) {
        if (
          adsThrottledThisRun ||
          String(e?.message).includes('ads-throttled-skip-heavy')
        ) {
          const { error } = await supa_update_facebook_insights({
            post_id: postId,
            insights: existing.insights,
            shares,
            total_reactions,
            last_synced_at: new Date().toISOString(),
          } as any)

          return {
            postId,
            userId,
            status: error ? 'error:update' : 'ok:shares-only',
            ...(error ? { message: String(error) } : {}),
            reactions_supported,
            ...(reactions_error ? { reactions_error } : {}),
            total_reactions,
            shares,
          }
        }

        return {
          postId,
          userId,
          status: 'error:update',
          message: extractMetaErr(e).msg ?? String(e),
        }
      }
    } catch (e: any) {
      return {
        postId,
        userId,
        status: 'error:exception',
        message: extractMetaErr(e).msg ?? String(e),
      }
    }
  }

  const processed = await runWithConcurrency(
    candidates,
    WORKER_CONCURRENCY,
    worker,
  )

  const results = [...processed, ...skipped]

  // For reporting (computed from processed to avoid concurrency issues)
  const reactionsOkCount = processed.filter(
    (r: any) => 'reactions_supported' in r && r.reactions_supported === true,
  ).length

  const reactionsUnsupportedCount = processed.filter(
    (r: any) => 'reactions_supported' in r && r.reactions_supported === false,
  ).length

  return NextResponse.json({
    ok: true as const,
    runId,
    scanned: posts?.length ?? 0,
    candidates: candidates.length,
    processed: processed.length,
    skipped: skipped.length,
    adsThrottledThisRun,
    reactionsOkCount,
    reactionsUnsupportedCount,
    results,
    note: `Cooldown=${SYNC_COOLDOWN_MINUTES}m. Concurrency=${WORKER_CONCURRENCY}. Light=${limiterLight.minTimeMs}ms Heavy=${limiterHeavy.minTimeMs}ms (single-flight).`,
  })
}
