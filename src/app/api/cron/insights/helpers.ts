import { RegionInsightByDate } from '@/app/utilities/facebook/util_fb_reachByRegion_multiAds'

type Row = {
  cl_region: string
  cl_reach: number
  cl_impressions?: number
  cl_country_code: string
}

const makeKey = (region: string, country: string) =>
  `${region}|${(country || '').toUpperCase()}`

/** Merge rows within ONE date (dedupe per region+country; sum reach/imp). */
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

/**
 * Replace-on-overlap strategy:
 * - Keep all old days that don't appear in fresh.
 * - For any date that exists in fresh, REPLACE that date's rows with fresh rows.
 * - Always union adIds.
 */
export const merge_old_and_new_regionInsightsByDate = (
  oldI: RegionInsightByDate | undefined,
  freshI: RegionInsightByDate
): RegionInsightByDate => {
  if (!oldI || !oldI.days?.length) {
    return {
      adIds: [...new Set(freshI.adIds)],
      days: [...freshI.days].map((d) => ({
        date: d.date,
        rows: mergeRegionRows([], d.rows),
      })),
    }
  }

  const adIds = Array.from(
    new Set([...(oldI.adIds ?? []), ...(freshI.adIds ?? [])])
  )

  // Index fresh by date for O(1) replacement checks.
  const freshByDate = new Map<string, Row[]>()
  for (const d of freshI.days ?? []) {
    // normalize/dedupe within the day just in case
    freshByDate.set(d.date, mergeRegionRows([], d.rows))
  }

  const outDaysMap = new Map<string, Row[]>()

  // 1) Start with all old days that are NOT in fresh
  for (const d of oldI.days ?? []) {
    if (!freshByDate.has(d.date)) {
      // keep old day (normalize/dedupe within day)
      outDaysMap.set(d.date, mergeRegionRows([], d.rows))
    }
    // if fresh has this date, we will replace later
  }

  // 2) Add/replace with fresh days
  for (const [date, rows] of freshByDate.entries()) {
    outDaysMap.set(date, rows) // replace-on-overlap
  }

  // 3) Build sorted array
  const days = [...outDaysMap.entries()]
    .map(([date, rows]) => ({ date, rows }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))

  return { adIds, days }
}
