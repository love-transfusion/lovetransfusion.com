/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import pLimit from 'p-limit'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fetchAdWiseInsights } from '@/app/utilities/facebook/util_fb_insights'
import { util_fb_postID } from '@/app/utilities/facebook/new/util_fb_postID'
import { util_fb_pageToken } from '@/app/utilities/facebook/new/util_fb_pageToken'
import { util_fetchFBAdShareCount } from '@/app/utilities/facebook/util_fetchFBAdShareCount'
import { Json } from '@/types/database.types'

export const runtime = 'nodejs'

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${process.env.CRON_SECRET}`) return true
  return false
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createAdmin()

  // 0) load users who have ad IDs configured
  const { data: users, error: usersErr } = await supabase
    .from('users')
    .select('id, fb_ad_IDs')

  if (usersErr) {
    return NextResponse.json(
      { ok: false, error: usersErr.message },
      { status: 500 }
    )
  }

  // Build tasks: (user_id, ad_id)
  const tasks: Array<{ user_id: string; ad_id: string }> = []
  for (const u of users ?? []) {
    const user_id = u.id as string
    const raw = u.fb_ad_IDs as any
    let adIds: string[] = []
    if (Array.isArray(raw)) {
      adIds = raw
        .map((x: any) => (typeof x === 'string' ? x : x?.id))
        .filter((x: any) => typeof x === 'string' && x.length > 0)
    }
    for (const ad_id of adIds) tasks.push({ user_id, ad_id })
  }

  if (tasks.length === 0) {
    return NextResponse.json({ ok: true, tasks: 0, upserts: 0 })
  }

  const limit = pLimit(5)
  const nowIso = new Date().toISOString()

  const fetched = await Promise.allSettled(
    tasks.map(({ user_id, ad_id }) =>
      limit(async () => {
        const { data, error } = await util_fetchAdWiseInsights({ ad_id })
        if (error) throw new Error(error)

        // --- NEW share count logic ---
        let shares: number | null = null
        try {
          const { data: postId } = await util_fb_postID({ adId: ad_id })
          if (postId) {
            const pageId = postId.includes('_') ? postId.split('_')[0] : null
            if (pageId) {
              const { data: pageAccessToken } = await util_fb_pageToken({
                pageId,
              })
              if (pageAccessToken) {
                const { count } = await util_fetchFBAdShareCount({
                  postID: postId,
                  pageAccessToken,
                })
                shares = Number.isFinite(count) ? count : 0
              }
            }
          }
        } catch {
          shares = null
        }

        const insights = data as Json
        // Use your interface for type safety
        const row: I_supa_facebook_insights_insert = {
          user_id,
          ad_id,
          insights: insights ?? [],
          last_synced_at: nowIso,
          shares: shares ?? 0,
        }
        return row
      })
    )
  )

  const rows: I_supa_facebook_insights_insert[] = []
  const errors: Array<{ user_id: string; ad_id: string; error: string }> = []

  fetched.forEach((r, idx) => {
    const t = tasks[idx]
    if (r.status === 'fulfilled') {
      rows.push(r.value)
    } else {
      errors.push({
        user_id: t.user_id,
        ad_id: t.ad_id,
        error: r.reason?.message ?? 'fetch failed',
      })
    }
  })

  if (rows.length > 0) {
    const CHUNK = 500
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK)
      const { error: upErr } = await supabase.from('facebook_insights').upsert(
        chunk.map((r) => ({
          user_id: r.user_id,
          ad_id: r.ad_id,
          insights: r.insights,
          last_synced_at: r.last_synced_at,
          shares: r.shares,
        })),
        { onConflict: 'user_id,ad_id' } as any
      )
      if (upErr) {
        console.error('insights upsert error:', upErr.message)
      }
    }
  }

  return NextResponse.json({
    ok: true,
    tasks: tasks.length,
    fetched_ok: rows.length,
    fetched_err: errors.length,
    errors,
  })
}
