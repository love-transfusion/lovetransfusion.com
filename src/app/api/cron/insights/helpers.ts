/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegionInsightByDate } from '@/app/utilities/facebook/util_fb_reachByRegion_multiAds'
// updated vercel envs
type Row = {
  cl_region: string
  cl_reach: number
  cl_impressions?: number
  cl_country_code: string
}

const makeKey = (region: string, country: string) =>
  `${region}|${(country || '').toUpperCase()}`

const mergeRegionRows = (a: Row[] = [], b: Row[] = []): Row[] => {
  const map = new Map<string, Row>()
  for (const r of [...a, ...b]) {
    const region = r.cl_region ?? 'Unknown'
    const country = (r.cl_country_code ?? '').toUpperCase()
    const key = makeKey(region, country)

    const prev = map.get(key)
    if (!prev) {
      map.set(key, {
        cl_region: region,
        cl_country_code: country,
        cl_reach: r.cl_reach ?? 0,
        cl_impressions: r.cl_impressions ?? 0,
      })
    } else {
      map.set(key, {
        cl_region: region,
        cl_country_code: country,
        cl_reach: (prev.cl_reach ?? 0) + (r.cl_reach ?? 0),
        cl_impressions: (prev.cl_impressions ?? 0) + (r.cl_impressions ?? 0),
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.cl_reach - a.cl_reach)
}

const isValidRegionInsight = (x: any): x is RegionInsightByDate =>
  !!x && Array.isArray(x.days) && Array.isArray(x.adIds)

const isPlaceholderInsight = (x: any) =>
  !!x &&
  Array.isArray(x.days) &&
  x.days.length === 0 &&
  !!x.meta?.skippedHeavy

export const merge_old_and_new_regionInsightsByDate = (
  oldI: RegionInsightByDate | undefined,
  freshI: RegionInsightByDate,
): RegionInsightByDate => {
  // ✅ If old is missing/invalid/placeholder → just take fresh (normalized)
  if (!isValidRegionInsight(oldI) || isPlaceholderInsight(oldI)) {
    return {
      adIds: [...new Set(freshI.adIds ?? [])],
      days: (freshI.days ?? []).map((d) => ({
        date: d.date,
        rows: mergeRegionRows([], d.rows as any),
      })),
    }
  }

  const adIds = Array.from(
    new Set([...(oldI.adIds ?? []), ...(freshI.adIds ?? [])]),
  )

  const freshByDate = new Map<string, Row[]>()
  for (const d of freshI.days ?? []) {
    freshByDate.set(d.date, mergeRegionRows([], d.rows as any))
  }

  const outDaysMap = new Map<string, Row[]>()

  for (const d of oldI.days ?? []) {
    if (!freshByDate.has(d.date)) {
      outDaysMap.set(d.date, mergeRegionRows([], d.rows as any))
    }
  }

  for (const [date, rows] of freshByDate.entries()) {
    outDaysMap.set(date, rows)
  }

  const days = [...outDaysMap.entries()]
    .map(([date, rows]) => ({ date, rows }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))

  return { adIds, days }
}
