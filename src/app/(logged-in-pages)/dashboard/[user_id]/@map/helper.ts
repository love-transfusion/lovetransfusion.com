// mergeRowsByRegion.ts
type Row = {
  cl_region: string
  cl_reach: number
  cl_impressions?: number
  cl_country_code: string
}

type DayBucket = {
  date: string
  rows: Row[]
}

type RegionInsightByDateLike = {
  days: DayBucket[]
  adIds?: string[]
}

type MergeOptions = {
  /** What to do when a region spans multiple country codes */
  multiCountryBehavior?: 'multi' | 'drop' | 'concat' | 'keep-first'
  /** When concat, what delimiter to use */
  concatDelimiter?: string
}

/**
 * Collapse all days into totals per cl_region (case-sensitive).
 * - Sums reach and impressions across all days.
 * - Country code handling is configurable (default: 'MULTI' if mixed).
 * - Sorted by cl_reach desc.
 */
export const mergeRowsByRegion = (
  input: RegionInsightByDateLike,
  opts: MergeOptions = {}
): Row[] => {
  const {
    multiCountryBehavior = 'multi', // 'multi' | 'drop' | 'concat' | 'keep-first'
    concatDelimiter = ',',
  } = opts

  const byRegion = new Map<
    string,
    {
      reach: number
      impressions: number
      countryCodes: Set<string>
      firstCode?: string
    }
  >()

  for (const day of input.days ?? []) {
    for (const r of day.rows ?? []) {
      const region = r.cl_region ?? 'Unknown'
      const reach = Number(r.cl_reach ?? 0)
      const impressions = Number(r.cl_impressions ?? 0)
      const code = (r.cl_country_code ?? '').toUpperCase()

      const prev = byRegion.get(region)
      if (!prev) {
        const set = new Set<string>()
        if (code) set.add(code)
        byRegion.set(region, {
          reach,
          impressions,
          countryCodes: set,
          firstCode: code || undefined,
        })
      } else {
        prev.reach += reach
        prev.impressions += impressions
        if (code) prev.countryCodes.add(code)
      }
    }
  }

  const rows: Row[] = []
  for (const [region, agg] of byRegion.entries()) {
    let cl_country_code = ''

    const codes = Array.from(agg.countryCodes)
    if (codes.length <= 1) {
      // zero or one unique code → keep it (or empty)
      cl_country_code = codes[0] ?? ''
    } else {
      // multiple codes → apply behavior
      switch (multiCountryBehavior) {
        case 'drop':
          cl_country_code = ''
          break
        case 'concat':
          cl_country_code = codes.sort().join(concatDelimiter)
          break
        case 'keep-first':
          cl_country_code = agg.firstCode ?? codes[0]
          break
        case 'multi':
        default:
          cl_country_code = 'MULTI'
      }
    }

    rows.push({
      cl_region: region,
      cl_country_code,
      cl_reach: agg.reach,
      cl_impressions: agg.impressions,
    })
  }

  // Sort by reach desc (stable enough for UI)
  rows.sort((a, b) => b.cl_reach - a.cl_reach)

  return rows
}
