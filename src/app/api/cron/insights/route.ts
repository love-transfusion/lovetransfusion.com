// app/api/cron/sync-fb-insights/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { Json } from '@/types/database.types'
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

type UserRow = {
  id: string
  facebook_insights: Array<{
    insights: Json
    post_id: string
    shares: number
    total_reactions: number
    last_synced_at: string
    created_at: string
  }>
  facebook_posts: { post_id: string } | null
}

type JobResult =
  | { userId: string; status: 'skipped:no-postid' | 'skipped:cooldown' }
  | { userId: string; status: 'ok:insert' | 'ok:update' }
  | {
      userId: string
      status: 'error:insert' | 'error:update' | 'error:exception'
      message?: string
    }

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  return (
    !!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`
  )
}

const runWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  worker: (item: T, idx: number) => Promise<R>
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

// Soft time guard to exit before platform timeout
const timeExceeded = (startedMs: number, softMs = 250_000) =>
  Date.now() - startedMs >= softMs

export const GET = async (req: NextRequest) => {
  try {
    if (!isAuthorizedCron(req)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = await createAdmin()
    const started = Date.now()

    // ---- Tunables (no query params) ----
    const SCAN_PAGE_SIZE = 400 // users fetched per scan page
    const PROCESS_LIMIT = 80 // max users processed per invocation
    const WORKER_CONCURRENCY = 3 // parallel workers within this invocation
    const SYNC_COOLDOWN_MINUTES = 2

    const cooldownCutoffISO = new Date(
      Date.now() - SYNC_COOLDOWN_MINUTES * 60_000
    ).toISOString()

    // Cache page access token once per run
    let pageAccessToken: string | null = null
    try {
      const { data } = await util_fb_pageToken({
        pageId: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
      })
      pageAccessToken = data
    } catch {
      pageAccessToken = null
    }

    let offset = 0
    let processed = 0
    const allResults: JobResult[] = []

    while (!timeExceeded(started) && processed < PROCESS_LIMIT) {
      const { data, error } = await supabase
        .from('users')
        .select('id,facebook_insights(*),facebook_posts(post_id)')
        .range(offset, offset + SCAN_PAGE_SIZE - 1)

      if (error) {
        return NextResponse.json(
          {
            ok: false as const,
            error: 'select-users',
            details: error.message,
            processed,
            results: allResults,
          },
          { status: 500 }
        )
      }

      const users = (data ?? []) as unknown as UserRow[]
      if (!users.length) break

      // Pick candidates:
      // - must have post_id
      // - AND (no insights yet OR latest.last_synced_at < cooldownCutoffISO)
      const candidates: UserRow[] = []
      for (const u of users) {
        if (!u.facebook_posts?.post_id) {
          allResults.push({ userId: u.id, status: 'skipped:no-postid' })
          continue
        }
        const rows = Array.isArray(u.facebook_insights)
          ? u.facebook_insights
          : []
        if (rows.length === 0) {
          candidates.push(u) // needs init
          continue
        }
        rows.sort((a, b) => {
          const A = a.last_synced_at || a.created_at || ''
          const B = b.last_synced_at || b.created_at || ''
          return A < B ? 1 : A > B ? -1 : 0
        })
        const latest = rows[0]
        if (!latest || (latest.last_synced_at ?? '') < cooldownCutoffISO) {
          candidates.push(u) // stale beyond cooldown
        } else {
          allResults.push({ userId: u.id, status: 'skipped:cooldown' })
        }
      }

      if (!candidates.length) {
        offset += SCAN_PAGE_SIZE
        continue
      }

      const toProcess = candidates.slice(
        0,
        Math.max(0, PROCESS_LIMIT - processed)
      )

      const worker = async (user: UserRow): Promise<JobResult> => {
        try {
          if (timeExceeded(started)) {
            return {
              userId: user.id,
              status: 'error:exception',
              message: 'time-budget-exceeded',
            }
          }

          const post_id = user.facebook_posts!.post_id

          // Shares + reactions (best-effort)
          let shares = 0
          let total_reactions = 0
          try {
            if (pageAccessToken) {
              const [sharesRes, reactionsRes] = await Promise.all([
                util_fb_shares({ postID: post_id, pageAccessToken }),
                util_fb_reactions_total(post_id),
              ])
              shares = sharesRes.count ?? 0
              total_reactions = reactionsRes.totalReactions ?? 0
            }
          } catch {
            shares = 0
            total_reactions = 0
          }

          const rows = Array.isArray(user.facebook_insights)
            ? user.facebook_insights
            : []
          rows.sort((a, b) => {
            const A = a.last_synced_at || a.created_at || ''
            const B = b.last_synced_at || b.created_at || ''
            return A < B ? 1 : A > B ? -1 : 0
          })
          const latest = rows[0]

          if (!latest) {
            // Initialize once → 37 months until yesterday
            const init = await util_fb_reachByRegion_multiAds({
              endAnchor: '37mon',
              post_id,
            })
            const { error } = await supa_insert_facebook_insights({
              user_id: user.id,
              insights: init,
              post_id,
              shares,
              total_reactions,
              last_synced_at: new Date().toISOString(), // UTC
            })
            return {
              userId: user.id,
              status: error ? 'error:insert' : 'ok:insert',
              ...(error ? { message: String(error) } : {}),
            }
          }

          // Merge existing with today's partial
          const existingInsights = latest.insights
          const fresh = await util_fb_reachByRegion_multiAds({
            endAnchor: 'today',
            post_id,
          })
          const merged = merge_old_and_new_regionInsightsByDate(
            existingInsights as any,
            fresh
          )
          const { error } = await supa_update_facebook_insights({
            insights: merged,
            post_id,
            shares,
            total_reactions,
            last_synced_at: new Date().toISOString(), // UTC
          })
          return {
            userId: user.id,
            status: error ? 'error:update' : 'ok:update',
            ...(error ? { message: String(error) } : {}),
          }
        } catch (e: any) {
          return {
            userId: user.id,
            status: 'error:exception',
            message: e?.message ?? String(e),
          }
        }
      }

      const pageResults = await runWithConcurrency(
        toProcess,
        WORKER_CONCURRENCY,
        worker
      )
      allResults.push(...pageResults)
      processed += pageResults.length

      offset += SCAN_PAGE_SIZE
    }

    return NextResponse.json({
      ok: true as const,
      processed,
      results: allResults,
      note: `Cooldown=${SYNC_COOLDOWN_MINUTES}m. Users updated at most once per ${SYNC_COOLDOWN_MINUTES} minutes.`,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false as const,
        error: 'unhandled',
        details: err?.message ?? String(err),
      },
      { status: 500 }
    )
  }
}
