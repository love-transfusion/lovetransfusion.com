/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import pLimit from 'p-limit'
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { ga_selectGoogleAnalyticsData } from '@/app/utilities/analytics/googleAnalytics'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'

export const runtime = 'nodejs'

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

type GARow = {
  user_id: string
  analytics: any // jsonb
  last_synced_at: string
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createAdmin()

  // 0) Load users with their path_url (used as GA pagePath filter)
  const { data: oldUsers, error: usersErr } = await supabase
    .from('users')
    .select('id, recipients(*)')

  if (usersErr) {
    return NextResponse.json(
      { ok: false, error: usersErr.message },
      { status: 500 }
    )
  }

  const filteredusers =
    oldUsers?.filter((item) => !!item.recipients.length) ?? []

  const users = filteredusers.map((user) => {
    const recipient = user.recipients[0].recipient as unknown as
      | I_supaorg_recipient
      | undefined

    const paths: string[] = []

    if (recipient?.path_url) {
      // default path
      paths.push(`/${recipient.path_url}`)

      // extra /c/ path for church template
      if (recipient.recipient_template === 'church') {
        paths.push(`/c/${recipient.path_url}`)
      }
    }

    return { paths, id: user.id as string }
  })

  // Build tasks (skip users without a path if you only want page-level stats)
  const tasks = (users ?? [])
    .filter((u) => u.paths.length > 0)
    .map((u) => ({ user_id: u.id, paths: u.paths }))

  if (tasks.length === 0) {
    return NextResponse.json({ ok: true, tasks: 0, upserts: 0 })
  }

  const limit = pLimit(5) // tune concurrency re: GA4 quotas
  const nowIso = new Date().toISOString()

  const fetched = await Promise.allSettled(
    tasks.map((t) =>
      limit(async () => {
        // Fetch GA data for all paths for this user
        const ga = await ga_selectGoogleAnalyticsData({
          paths: t.paths,
        })
        const row: GARow = {
          user_id: t.user_id,
          analytics: ga ?? [],
          last_synced_at: nowIso,
        }
        return row
      })
    )
  )

  const rows: GARow[] = []
  const errors: Array<{ user_id: string; paths: string[]; error: string }> = []

  fetched.forEach((r, i) => {
    const t = tasks[i]
    if (r.status === 'fulfilled') {
      rows.push(r.value)
    } else {
      errors.push({
        user_id: t.user_id,
        paths: t.paths,
        error: (r as PromiseRejectedResult).reason?.message ?? 'fetch failed',
      })
    }
  })

  // 3) Upsert in chunks
  if (rows.length > 0) {
    const CHUNK = 500
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK)
      const { error: upErr } = await supabase.from('google_analytics').upsert(
        chunk.map((r) => ({
          user_id: r.user_id,
          analytics: r.analytics,
          last_synced_at: r.last_synced_at,
        })),
        { onConflict: 'user_id' } as any
      )
      if (upErr) console.error('ga upsert error:', upErr.message)
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
