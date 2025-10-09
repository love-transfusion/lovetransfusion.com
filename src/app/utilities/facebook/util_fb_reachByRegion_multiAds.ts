/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { util_fb_AdIDs } from './util_fb_AdIDs'

type TimeRange = { since: string; until: string }

type Row = {
  cl_region: string
  cl_reach: number
  cl_impressions?: number
  cl_country_code: string
}

type DayBucket = {
  date: string // 'YYYY-MM-DD' (UTC)
  rows: Row[] // merged rows for that date
}

export type RegionInsightByDate = {
  adIds: string[]
  days: DayBucket[]
}

type EndAnchor = '37mon' | 'today'

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
 *  - '37mon': end = yesterday;     start = max(today-37mo, <= end)
 *  - 'today': end = today;         start = today (single-day)
 * Chunk into <=365-day slices for stability.
 */
const buildWindows = (endAnchor: EndAnchor): { windows: TimeRange[] } => {
  const todayUTC = utcStartOfToday()
  const retentionFloor = addUtcMonths(todayUTC, -37)

  let start: Date
  let end: Date

  if (endAnchor === 'today') {
    start = todayUTC
    end = todayUTC
  } else {
    end = addUtcDays(todayUTC, -1) // yesterday
    start = retentionFloor > end ? end : retentionFloor
  }

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

  return { windows }
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
  p.set('time_increment', '1') // daily buckets
  p.set('limit', '500')
  if (after) p.set('after', after)
  return `${FB_BASE}/${adId}/insights?${p.toString()}`
}

/**
 * Fetch per-day rows for a single (adId, time range).
 * Returns Map<date, Map<region|country, {reach,impressions,region,country}>>
 */
const getPerDayMapsForAdWindow = async (adId: string, tr: TimeRange) => {
  let url = buildAdInsightsUrl(adId, tr)
  const byDate = new Map<
    string,
    Map<
      string,
      { reach: number; impressions: number; region: string; country: string }
    >
  >()

  while (url) {
    const json = await fetchJson(url)
    const data: any[] = Array.isArray(json.data) ? json.data : []

    for (const d of data) {
      const date = (d.date_start as string) ?? null
      if (!date) continue

      const region = (d.region as string) ?? 'Unknown'
      const country = ((d.country as string) ?? '').toUpperCase()
      const reach = Number(d.reach ?? 0)
      const impressions = d.impressions != null ? Number(d.impressions) : 0
      if (reach <= 0) continue

      let dateMap = byDate.get(date)
      if (!dateMap) {
        dateMap = new Map()
        byDate.set(date, dateMap)
      }

      const key = `${region}|${country}`
      const prev = dateMap.get(key) ?? {
        reach: 0,
        impressions: 0,
        region,
        country,
      }
      dateMap.set(key, {
        reach: prev.reach + reach,
        impressions: prev.impressions + impressions,
        region,
        country,
      })
    }

    url = (json?.paging?.next as string | undefined) || ''
  }

  return byDate
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

const mergeResults = (
  results: Map<
    string,
    Map<
      string,
      { reach: number; impressions: number; region: string; country: string }
    >
  >[]
): DayBucket[] => {
  const globalByDate = new Map<
    string,
    Map<
      string,
      { reach: number; impressions: number; region: string; country: string }
    >
  >()

  for (const byDate of results) {
    for (const [date, dateMap] of byDate.entries()) {
      let destDateMap = globalByDate.get(date)
      if (!destDateMap) {
        destDateMap = new Map()
        globalByDate.set(date, destDateMap)
      }
      for (const [key, v] of dateMap.entries()) {
        const prev = destDateMap.get(key) ?? {
          reach: 0,
          impressions: 0,
          region: v.region,
          country: v.country,
        }
        destDateMap.set(key, {
          reach: prev.reach + v.reach,
          impressions: prev.impressions + v.impressions,
          region: prev.region,
          country: prev.country,
        })
      }
    }
  }

  const days: DayBucket[] = [...globalByDate.entries()]
    .map(([date, dateMap]) => {
      const rows: Row[] = [...dateMap.values()]
        .map((v) => ({
          cl_region: v.region,
          cl_country_code: v.country,
          cl_reach: v.reach,
          cl_impressions: v.impressions,
        }))
        .sort((a, b) => b.cl_reach - a.cl_reach)
      return { date, rows }
    })
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))

  return days
}

/**
 * Main: supports '37mon' and 'today'
 */
export const util_fb_reachByRegion_multiAds = async ({
  endAnchor,
  post_id,
  concurrency = 3,
}: {
  endAnchor: EndAnchor
  post_id: string
  concurrency?: number
}): Promise<RegionInsightByDate> => {
  const adIds = await util_fb_AdIDs(post_id)
  if (!adIds || !adIds.length) throw new Error('Ad IDs is missing')
  if (!ACCESS_TOKEN) throw new Error('FACEBOOK_SYSTEM_TOKEN is missing')

  const { windows } = buildWindows(endAnchor)

  const tasks: Array<
    () => Promise<
      Map<
        string,
        Map<
          string,
          {
            reach: number
            impressions: number
            region: string
            country: string
          }
        >
      >
    >
  > = []
  for (const adId of adIds) {
    for (const w of windows) {
      tasks.push(() => getPerDayMapsForAdWindow(adId, w))
    }
  }

  const results = await withLimit(concurrency, tasks)
  const days = mergeResults(results)
  return { adIds, days }
}

/**
 * Convenience helper for "today" (single-day, partial)
 */
export const util_fb_reachByRegion_today_multiAds = async ({
  post_id,
  concurrency = 3,
}: {
  post_id: string
  concurrency?: number
}) => {
  return await util_fb_reachByRegion_multiAds({
    endAnchor: 'today',
    post_id,
    concurrency,
  })
}
