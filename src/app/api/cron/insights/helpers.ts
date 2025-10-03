type TimeRange = { since: string; until: string }
type Row = {
  cl_region: string
  cl_reach: number
  cl_impressions?: number
  cl_country_code: string
}

type RegionInsight = {
  adIds: string[]
  timeRangeRequested: TimeRange
  timeRangeApplied: TimeRange
  rows: Row[]
  totalReach: number
  messages?: string[]
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
        cl_country_code: country, // ✅ keep ISO-2, not region name
        cl_reach: (prev.cl_reach ?? 0) + (r.cl_reach ?? 0),
        cl_impressions: (prev.cl_impressions ?? 0) + (r.cl_impressions ?? 0),
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.cl_reach - a.cl_reach)
}

const uniq = <T>(arr: T[] = []): T[] => Array.from(new Set(arr))

/**
 * Merge "old" (already stored) insights with "fresh" (just fetched) insights.
 */
export const merge_old_and_new_insights = (
  oldI: Partial<RegionInsight> | undefined,
  freshI: RegionInsight
): RegionInsight => {
  if (!oldI || Object.keys(oldI).length === 0) {
    const rows = mergeRegionRows([], freshI.rows)
    return {
      ...freshI,
      adIds: uniq(freshI.adIds),
      rows,
      totalReach: rows.reduce((s, r) => s + (r.cl_reach ?? 0), 0), // ✅ recompute
    }
  }

  const old = oldI as RegionInsight
  const rows = mergeRegionRows(old.rows ?? [], freshI.rows ?? [])

  return {
    adIds: uniq([...(old.adIds ?? []), ...(freshI.adIds ?? [])]),
    timeRangeRequested: {
      since:
        old.timeRangeRequested?.since && freshI.timeRangeRequested?.since
          ? (old.timeRangeRequested.since < freshI.timeRangeRequested.since
              ? old.timeRangeRequested.since
              : freshI.timeRangeRequested.since)
          : old.timeRangeRequested?.since ?? freshI.timeRangeRequested.since,
      until:
        old.timeRangeRequested?.until && freshI.timeRangeRequested?.until
          ? (old.timeRangeRequested.until > freshI.timeRangeRequested.until
              ? old.timeRangeRequested.until
              : freshI.timeRangeRequested.until)
          : old.timeRangeRequested?.until ?? freshI.timeRangeRequested.until,
    },
    timeRangeApplied: {
      since:
        old.timeRangeApplied?.since && freshI.timeRangeApplied?.since
          ? (old.timeRangeApplied.since < freshI.timeRangeApplied.since
              ? old.timeRangeApplied.since
              : freshI.timeRangeApplied.since)
          : old.timeRangeApplied?.since ?? freshI.timeRangeApplied.since,
      until:
        old.timeRangeApplied?.until && freshI.timeRangeApplied?.until
          ? (old.timeRangeApplied.until > freshI.timeRangeApplied.until
              ? old.timeRangeApplied.until
              : freshI.timeRangeApplied.until)
          : old.timeRangeApplied?.until ?? freshI.timeRangeApplied.until,
    },
    rows,
    totalReach: rows.reduce((s, r) => s + (r.cl_reach ?? 0), 0), // ✅ recompute
    messages: uniq([...(old.messages ?? []), ...(freshI.messages ?? [])]),
  }
}
