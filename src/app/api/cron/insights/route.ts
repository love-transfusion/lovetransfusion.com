// app/api/cron/sync-fb-insights/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Json } from '@/types/database.types'
import {
  supa_insert_facebook_insights2,
  supa_update_facebook_insights2,
} from '@/app/_actions/facebook_insights2/actions'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { merge_old_and_new_insights } from '@/app/api/cron/insights/helpers'
import { util_formatDateToUTCString } from '@/app/utilities/date-and-time/util_formatDateToUTCString'
import {
  I_Region_Insight_Types,
  util_fb_reachByRegion_multiAds,
} from '@/app/utilities/facebook/util_fb_reachByRegion_multiAds'
import { NextRequest, NextResponse } from 'next/server'
import { util_fb_pageToken } from '@/app/utilities/facebook/util_fb_pageToken'
import { util_fb_shares } from '@/app/utilities/facebook/util_fb_shares'
import { util_fb_reactions_total } from '@/app/utilities/facebook/util_fb_reactions_total'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  return (
    !!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`
  )
}

type UserRow = {
  id: string
  facebook_insights2: Array<{
    insights: Json
    post_id: string
    shares: number
    last_synced_at: string
    created_at: string
  }>
  facebook_posts: {
    post_id: string
  } | null
}

type JobResult =
  | { userId: string; status: 'skipped:no-postid' }
  | { userId: string; status: 'ok:insert' | 'ok:update' | 'ok:shares-only' }
  | {
      userId: string
      status: 'error:insert' | 'error:update' | 'error:exception'
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

export const GET = async (req: NextRequest) => {
  try {
    if (!isAuthorizedCron(req)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = await createAdmin()

    const now = new Date()
    const yesterdayIso = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)
    ).toISOString()

    // 1) Fetch ALL users that have at least one insights row (no .lt filter)
    const { data: users, error: usersErr } = await supabase
      .from('users')
      .select('id,facebook_insights2(*),facebook_posts(post_id)')

    if (usersErr) {
      return NextResponse.json(
        {
          ok: false as const,
          error: 'select-users',
          details: usersErr.message,
          processed: 0,
          results: [] as JobResult[],
        },
        { status: 500 }
      )
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        ok: true as const,
        processed: 0,
        results: [],
        note: 'No users to process.',
      })
    }

    // 2) Cache: postId per adId, and pageAccessToken once
    let pageAccessToken: string | null
    try {
      const { data } = await util_fb_pageToken({
        pageId: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
      })
      pageAccessToken = data
    } catch {
      pageAccessToken = null
    }

    const processUser = async (user: UserRow): Promise<JobResult> => {
      try {
        if (!user.facebook_posts?.post_id) {
          return { userId: user.id, status: 'skipped:no-postid' }
        }
        const post_id = user.facebook_posts.post_id

        // pick latest insights row for this user
        const rows = Array.isArray(user.facebook_insights2)
          ? user.facebook_insights2
          : []
        // ensure we pick the newest by last_synced_at (fallback: created_at)
        rows.sort((a, b) => {
          const A = a.last_synced_at || a.created_at || ''
          const B = b.last_synced_at || b.created_at || ''
          return A < B ? 1 : A > B ? -1 : 0
        })
        const latest = rows[0]
        if (!latest) {
          // treat as "no existing": init

          // shares + total reactions IN PARALLEL
          let shares = 0
          let total_reactions = 0
          try {
            if (pageAccessToken) {
              const [sharesRes, reactionsRes] = await Promise.all([
                util_fb_shares({ postID: post_id, pageAccessToken }),
                util_fb_reactions_total(post_id),
              ])
              const { count } = sharesRes
              const { totalReactions } = reactionsRes
              shares = Number.isFinite(count) ? count : 0
              total_reactions = totalReactions
            }
          } catch {
            shares = 0
            total_reactions = 0
          }

          const init = await util_fb_reachByRegion_multiAds({
            endAnchor: '37mon',
            post_id,
          })
          const { error } = await supa_insert_facebook_insights2({
            user_id: user.id,
            insights: init,
            post_id,
            shares,
            total_reactions,
            last_synced_at: util_formatDateToUTCString(
              new Date(init.timeRangeRequested.until)
            ),
          })
          return {
            userId: user.id,
            status: error ? 'error:insert' : 'ok:insert',
          }
        }

        // We have an existing row
        const existingInsights =
          latest.insights as unknown as I_Region_Insight_Types

        // Always refresh SHARES + TOTAL REACTIONS every run (in parallel)
        let shares = 0
        let total_reactions = 0
        try {
          if (pageAccessToken) {
            const [sharesRes, reactionsRes] = await Promise.all([
              util_fb_shares({ postID: post_id, pageAccessToken }),
              util_fb_reactions_total(post_id),
            ])
            const { count } = sharesRes
            const { totalReactions } = reactionsRes
            total_reactions = totalReactions
            shares = Number.isFinite(count) ? count : 0
          }
        } catch {
          shares = 0
          total_reactions = 0
        }

        // Decide if we also need heavy INSIGHTS update
        const needInsightsUpdate =
          new Date(latest.last_synced_at) < new Date(yesterdayIso)

        if (!needInsightsUpdate) {
          // Shares-only write (keep insights + last_synced_at unchanged)
          const { error } = await supa_update_facebook_insights2({
            insights: existingInsights,
            post_id,
            shares, // new shares
            total_reactions,
            last_synced_at: latest.last_synced_at, // unchanged
          })
          return {
            userId: user.id,
            status: error ? 'error:update' : 'ok:shares-only',
          }
        }

        // Heavy update (yesterday window)
        const fresh = await util_fb_reachByRegion_multiAds({
          post_id,
          endAnchor: 'yesterday',
        })
        const merged = merge_old_and_new_insights(existingInsights, fresh)

        const { error } = await supa_update_facebook_insights2({
          insights: merged,
          post_id,
          shares, // also persist new shares
          last_synced_at: util_formatDateToUTCString(
            new Date(fresh.timeRangeApplied.until)
          ),
        })
        return { userId: user.id, status: error ? 'error:update' : 'ok:update' }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return { userId: user.id, status: 'error:exception' }
      }
    }

    const CONCURRENCY = 4
    const results = await runWithConcurrency(users, CONCURRENCY, processUser)

    return NextResponse.json({
      ok: true as const,
      processed: results.length,
      results,
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
