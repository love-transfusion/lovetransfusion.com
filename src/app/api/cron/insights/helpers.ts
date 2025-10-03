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

const mergeRegionRows = (a: Row[] = [], b: Row[] = []): Row[] => {
  const map = new Map<string, Row>()
  for (const r of [...a, ...b]) {
    const prev = map.get(r.cl_region)
    if (!prev) {
      map.set(r.cl_region, { ...r })
    } else {
      map.set(r.cl_region, {
        cl_region: r.cl_region,
        cl_reach: (prev.cl_reach ?? 0) + (r.cl_reach ?? 0),
        cl_impressions:
          (prev.cl_impressions ?? 0) + (r.cl_impressions ?? 0) || undefined,
        cl_country_code: r.cl_region,
      })
    }
  }
  return Array.from(map.values())
}

const uniq = <T>(arr: T[] = []): T[] => Array.from(new Set(arr))

/**
 * Merge "old" (already stored) insights with "fresh" (just fetched) insights.
 * Assumes both shapes are RegionInsight-like.
 */
export const merge_old_and_new_insights = (
  oldI: Partial<RegionInsight> | undefined,
  freshI: RegionInsight
): RegionInsight => {
  if (!oldI || Object.keys(oldI).length === 0) {
    return {
      ...freshI,
      adIds: uniq(freshI.adIds),
      rows: mergeRegionRows([], freshI.rows),
    }
  }

  const old = oldI as RegionInsight

  return {
    adIds: uniq([...(old.adIds ?? []), ...(freshI.adIds ?? [])]),
    // Keep earliest "since" and latest "until" across both
    timeRangeRequested: {
      since:
        old.timeRangeRequested?.since && freshI.timeRangeRequested?.since
          ? old.timeRangeRequested.since < freshI.timeRangeRequested.since
            ? old.timeRangeRequested.since
            : freshI.timeRangeRequested.since
          : old.timeRangeRequested?.since ?? freshI.timeRangeRequested.since,
      until:
        old.timeRangeRequested?.until && freshI.timeRangeRequested?.until
          ? old.timeRangeRequested.until > freshI.timeRangeRequested.until
            ? old.timeRangeRequested.until
            : freshI.timeRangeRequested.until
          : old.timeRangeRequested?.until ?? freshI.timeRangeRequested.until,
    },
    timeRangeApplied: {
      since:
        old.timeRangeApplied?.since && freshI.timeRangeApplied?.since
          ? old.timeRangeApplied.since < freshI.timeRangeApplied.since
            ? old.timeRangeApplied.since
            : freshI.timeRangeApplied.since
          : old.timeRangeApplied?.since ?? freshI.timeRangeApplied.since,
      until:
        old.timeRangeApplied?.until && freshI.timeRangeApplied?.until
          ? old.timeRangeApplied.until > freshI.timeRangeApplied.until
            ? old.timeRangeApplied.until
            : freshI.timeRangeApplied.until
          : old.timeRangeApplied?.until ?? freshI.timeRangeApplied.until,
    },
    rows: mergeRegionRows(old.rows ?? [], freshI.rows ?? []),
    totalReach: (old.totalReach ?? 0) + (freshI.totalReach ?? 0),
    messages: uniq([...(old.messages ?? []), ...(freshI.messages ?? [])]),
  }
}
