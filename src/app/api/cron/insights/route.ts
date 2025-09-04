/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import pLimit from 'p-limit'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { util_fetchAdWiseInsights } from '@/app/utilities/facebook/util_fb_insights'

export const runtime = 'nodejs'

// Shape of a single row to upsert
type InsightsRow = {
  user_id: string
  ad_id: string
  insights: any // jsonb
  last_synced_at: string
}

export async function GET(req: NextRequest) {
  // Simple bearer auth so only the scheduler can call this
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.FACEBOOK_SYNC_SECRET!}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createAdmin()

  // 0) load users who have ad IDs configured
  // NOTE: fb_ad_IDs is a jsonb (or jsonb[]). We’ll read it as JSON and coerce to string[]
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
    // tolerate different shapes: jsonb array of strings or array of objects
    const raw = u.fb_ad_IDs as any
    let adIds: string[] = []
    if (Array.isArray(raw)) {
      // handles ["123","456"] OR [{id:"123"},{id:"456"}] OR mixed
      adIds = raw
        .map((x: any) => (typeof x === 'string' ? x : x?.id))
        .filter((x: any) => typeof x === 'string' && x.length > 0)
    }
    for (const ad_id of adIds) tasks.push({ user_id, ad_id })
  }

  if (tasks.length === 0) {
    return NextResponse.json({ ok: true, tasks: 0, upserts: 0 })
  }

  // 1) fetch insights concurrently but politely
  const limit = pLimit(5) // tune concurrency
  const nowIso = new Date().toISOString()

  // For each ad, call your util_fetchAdWiseInsights({ ad_id })
  const fetched = await Promise.allSettled(
    tasks.map(({ user_id, ad_id }) =>
      limit(async () => {
        const { data, error } = await util_fetchAdWiseInsights({ ad_id })
        if (error) throw new Error(error)
        // We’ll store the ENTIRE array returned for this ad in the jsonb column.
        // That keeps structure flexible.
        const row: InsightsRow = {
          user_id,
          ad_id,
          insights: data ?? [],
          last_synced_at: nowIso,
        }
        return row
      })
    )
  )

  // 2) prepare successful rows for upsert
  const rows: InsightsRow[] = []
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

  // 3) bulk upsert in chunks
  if (rows.length > 0) {
    const CHUNK = 500
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK)
      const { error: upErr } = await supabase.from('facebook_insights').upsert(
        chunk.map((r) => ({
          user_id: r.user_id,
          ad_id: r.ad_id,
          insights: r.insights, // jsonb
          last_synced_at: r.last_synced_at,
        })),
        { onConflict: 'user_id,ad_id' } as any
      )
      if (upErr) {
        // log and continue (don’t fail whole cron)
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
