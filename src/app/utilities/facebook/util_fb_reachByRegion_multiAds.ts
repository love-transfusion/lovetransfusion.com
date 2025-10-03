/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { util_fb_AdIDs } from './util_fb_AdIDs'

type TimeRange = { since: string; until: string }
type Row = {
  cl_region: string
  cl_reach: number
  cl_impressions: number
  cl_country_code: string
}

export type I_Region_Insight_Types = {
  adIds: string[]
  timeRangeRequested: TimeRange
  timeRangeApplied: TimeRange
  earliestAvailableSince: string
  clampedToRetentionWindow: boolean
  rows: Row[]
  totalReach: number
  messages: string[]
}

type EndAnchor = 'yesterday' | '37mon'

const FB_API_VERSION = 'v22.0'
const FB_BASE = `https://graph.facebook.com/${FB_API_VERSION}`
const ACCESS_TOKEN = process.env.FACEBOOK_SYSTEM_TOKEN!

const ymd = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .slice(0, 10)

const utcStartOfToday = (): Date =>
  new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    )
  )

const addUtcDays = (d: Date, days: number): Date => {
  const out = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  )
  out.setUTCDate(out.getUTCDate() + days)
  return out
}

const addUtcMonths = (d: Date, months: number): Date => {
  const out = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  )
  out.setUTCMonth(out.getUTCMonth() + months)
  return out
}

/**
 * Build windows based on endAnchor:
 *  - 'yesterday': end = yesterday; start = end - 2 days (short 3-day span)
 *  - '37mon':    end = today - 2 days; start = max(today - 37 months, <= end)
 * Notes:
 *  - Meta enforces start >= (today - 37 months), not relative to end (#3018).
 *  - We chunk into <=365d slices for stability.
 */
const buildWindows = (
  endAnchor: EndAnchor
): {
  windows: TimeRange[]
  timeRangeApplied: TimeRange
  earliestAvailableSince: string
  clamped: boolean
  messages: string[]
} => {
  const todayUTC = utcStartOfToday()
  const retentionFloor = addUtcMonths(todayUTC, -37) // rule #3018

  // Determine end
  const end =
    endAnchor === 'yesterday'
      ? addUtcDays(todayUTC, -1) // yesterday
      : addUtcDays(todayUTC, -2) // two days before today

  // Determine start
  let start: Date
  let clamped = false
  const messages: string[] = []

  if (endAnchor === 'yesterday') {
    // Short window: 2 days before yesterday ... yesterday
    start = addUtcDays(end, -2)
    messages.push(
      `Window anchored to 'yesterday': ${ymd(start)} → ${ymd(end)} (UTC).`
    )
  } else {
    // Long window: today-37mo ... (today-2d), clamped to Meta's retention floor
    start = retentionFloor
    if (start > end) {
      // Edge case (very new account or clock skew)
      start = end
    }
    clamped = true // by definition we're enforcing the 37-month floor
    messages.push(
      `Window anchored to '37mon': last 37 months ending ${ymd(end)} (UTC).`,
      `Start set to ${ymd(start)} to comply with Meta retention (#3018).`
    )
  }

  // Build <=365-day windows
  const windows: TimeRange[] = []
  if (start <= end) {
    let cursor = start
    while (cursor <= end) {
      const next = new Date(
        Date.UTC(
          cursor.getUTCFullYear(),
          cursor.getUTCMonth(),
          cursor.getUTCDate()
        )
      )
      next.setUTCDate(next.getUTCDate() + 364)
      const until = next > end ? end : next
      windows.push({ since: ymd(cursor), until: ymd(until) })
      const after = new Date(until)
      after.setUTCDate(after.getUTCDate() + 1)
      cursor = after
    }
  }

  return {
    windows,
    timeRangeApplied: { since: ymd(start), until: ymd(end) },
    earliestAvailableSince: ymd(retentionFloor),
    clamped,
    messages,
  }
}

const fetchJson = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    cache: 'no-store',
  })
  if (!res.ok)
    throw new Error(`Meta API error ${res.status}: ${await res.text()}`)
  return (await res.json()) as any
}

const buildAdInsightsUrl = (adId: string, tr: TimeRange, after?: string) => {
  const p = new URLSearchParams()
  p.set('breakdowns', 'country,region')
  p.set('level', 'ad')
  p.set('time_range', JSON.stringify(tr))
  p.set('fields', 'reach,impressions')
  p.set('limit', '500')
  if (after) p.set('after', after)
  return `${FB_BASE}/${adId}/insights?${p.toString()}`
}

const getRegionRowsForAdWindow = async (
  adId: string,
  tr: TimeRange
): Promise<Row[]> => {
  let url = buildAdInsightsUrl(adId, tr)
  const rows: Row[] = []

  while (url) {
    const json = await fetchJson(url)
    const data: any[] = Array.isArray(json.data) ? json.data : []
    for (const d of data) {
      const region = d.region ?? 'Unknown'
      const country = (d.country ?? '').toUpperCase() // ISO-2 (e.g., 'IN')
      const reach = Number(d.reach ?? 0)
      const impressions =
        d.impressions != null ? Number(d.impressions) : undefined
      if (reach > 0)
        rows.push({
          cl_region: region,
          cl_reach: reach,
          cl_impressions: impressions ?? 0,
          cl_country_code: country,
        })
    }
    url = (json?.paging?.next as string | undefined) || ''
  }

  // collapse within window
  const map = new Map<
    string,
    { reach: number; impressions: number; region: string; country: string }
  >()

  for (const r of rows) {
    const key = `${r.cl_region}|${r.cl_country_code}` // ← use region+country
    const prev = map.get(key) ?? {
      reach: 0,
      impressions: 0,
      region: r.cl_region,
      country: r.cl_country_code,
    }
    map.set(key, {
      reach: prev.reach + r.cl_reach,
      impressions: prev.impressions + r.cl_impressions,
      region: prev.region,
      country: prev.country,
    })
  }

  return [...map.values()].map((v) => ({
    cl_region: v.region,
    cl_country_code: v.country,
    cl_reach: v.reach,
    cl_impressions: v.impressions,
  }))
}

const withLimit = async <T>(
  limit: number,
  tasks: (() => Promise<T>)[]
): Promise<T[]> => {
  const results: T[] = []
  let idx = 0
  let active = 0

  return await new Promise<T[]>((resolve, reject) => {
    const next = () => {
      if (idx === tasks.length && active === 0) return resolve(results)
      while (active < limit && idx < tasks.length) {
        const i = idx++
        active++
        tasks[i]()
          .then((r) => results.push(r))
          .catch(reject)
          .finally(() => {
            active--
            next()
          })
      }
    }
    next()
  })
}

/**
 * PUBLIC: Reach by region across MULTIPLE Ad IDs.
 * - endAnchor:
 *   • 'yesterday' → end=yesterday, start=end-2d
 *   • '37mon'     → end=today-2d, start=max(today-37mo, <= end)  (Meta #3018)
 */
export const util_fb_reachByRegion_multiAds = async ({
  endAnchor,
  post_id,
  concurrency = 3,
}: {
  endAnchor: EndAnchor
  post_id: string
  concurrency?: number
}): Promise<I_Region_Insight_Types> => {
  const adIds = await util_fb_AdIDs(post_id)
  if (!adIds || !!!adIds.length) throw new Error('Ad IDs is missing')

  if (!ACCESS_TOKEN) throw new Error('FACEBOOK_SYSTEM_TOKEN is missing')

  const {
    windows,
    timeRangeApplied,
    earliestAvailableSince,
    clamped,
    messages,
  } = buildWindows(endAnchor)

  const requested: TimeRange = { ...timeRangeApplied }

  const tasks: Array<() => Promise<Row[]>> = []
  for (const adId of adIds)
    for (const w of windows) tasks.push(() => getRegionRowsForAdWindow(adId, w))

  const chunks = await withLimit(concurrency, tasks)

  const combined = new Map<
    string,
    { reach: number; impressions: number; region: string; country: string }
  >()

  for (const rows of chunks) {
    for (const r of rows) {
      const key = `${r.cl_region}|${r.cl_country_code}` // ← region+country again
      const prev = combined.get(key) ?? {
        reach: 0,
        impressions: 0,
        region: r.cl_region,
        country: r.cl_country_code,
      }
      combined.set(key, {
        reach: prev.reach + r.cl_reach,
        impressions: prev.impressions + r.cl_impressions,
        region: prev.region,
        country: prev.country,
      })
    }
  }

  const collapsed: Row[] = [...combined.values()]
    .map((v) => ({
      cl_region: v.region,
      cl_country_code: v.country,
      cl_reach: v.reach,
      cl_impressions: v.impressions,
    }))
    .sort((a, b) => b.cl_reach - a.cl_reach)

  const totalReach = collapsed.reduce((s, r) => s + r.cl_reach, 0)

  return {
    adIds,
    timeRangeRequested: requested,
    timeRangeApplied,
    earliestAvailableSince,
    clampedToRetentionWindow: clamped,
    rows: collapsed,
    totalReach,
    messages,
  }
}
