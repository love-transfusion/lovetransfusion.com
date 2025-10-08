'use server'

import { I_CountryPathTotalFormat } from './getAnalyticsCountryPathTotal'
import rawCities from '@/app/lib/geonames/cities.json'

type LocationEntry = {
  city: string
  country: string | null
  state: string
  lat: number
  lng: number
}

const geoDataset = rawCities as Record<string, LocationEntry>

export type GeoPoint = {
  name: string
  value: [number, number, number, number, number] // [lng, lat, views, hugs, messages]
}

const normalizeLocationKey = (str: string) =>
  str
    ?.replaceAll(/\bcity\b/gi, '')
    .replaceAll(' ', '')
    .trim()
    .toLowerCase()

// --- Lookups ---
// City lookup: normalized "city_countrycode" -> entry
const cityLookup = new Map<string, LocationEntry>()

// Region centroid: normalized "state_countrycode" -> { state, lat, lng }
type RegionCentroid = { state: string; lat: number; lng: number }
const regionCentroidLookup = new Map<string, RegionCentroid>()

// Build lookups (also compute region centroids)
{
  // temp aggregation store
  const agg = new Map<
    string,
    { state: string; sumLat: number; sumLng: number; count: number }
  >()

  for (const key of Object.keys(geoDataset)) {
    const entry = geoDataset[key]
    const cc = key.slice(-2).toLowerCase()

    // city lookup
    const cityKey = `${normalizeLocationKey(entry.city)}_${cc}`
    cityLookup.set(cityKey, entry)

    // region aggregation
    if (entry.state) {
      const regionKey = `${normalizeLocationKey(entry.state)}_${cc}`
      const cur = agg.get(regionKey)
      if (!cur) {
        agg.set(regionKey, {
          state: entry.state,
          sumLat: entry.lat,
          sumLng: entry.lng,
          count: 1,
        })
      } else {
        cur.sumLat += entry.lat
        cur.sumLng += entry.lng
        cur.count += 1
      }
    }
  }

  // finalize centroids
  for (const [key, v] of agg.entries()) {
    regionCentroidLookup.set(key, {
      state: v.state,
      lat: v.sumLat / v.count,
      lng: v.sumLng / v.count,
    })
  }
}

export const mapAnalyticsToGeoPoints = async (
  analytics: I_CountryPathTotalFormat[]
): Promise<GeoPoint[]> => {
  const resultMap = new Map<string, GeoPoint>()

  for (const record of analytics) {
    const rawCityName = record.cl_city || ''
    const rawRegionName = record.cl_region || ''
    const countryCodeKey = normalizeLocationKey(record.cl_country_code || '')

    const normalizedCityKey = normalizeLocationKey(rawCityName)
    const normalizedRegionKey = normalizeLocationKey(rawRegionName)

    const isCityMissing =
      !rawCityName ||
      rawCityName.trim().toLowerCase() === '(not set)' ||
      normalizedCityKey === '' ||
      normalizedCityKey === '(notset)'

    // 1) Try city
    const cityMatch = normalizedCityKey
      ? cityLookup.get(`${normalizedCityKey}_${countryCodeKey}`)
      : undefined

    // 2) If no city or unusable, try region centroid
    const regionMatch =
      !cityMatch && (isCityMissing || !cityMatch) && normalizedRegionKey
        ? regionCentroidLookup.get(`${normalizedRegionKey}_${countryCodeKey}`)
        : undefined

    // If neither matched, skip
    if (!cityMatch && !regionMatch) continue

    // Coordinates + display name
    const isRegionChosen = !!regionMatch && !cityMatch
    const lng = parseFloat(
      (isRegionChosen ? regionMatch!.lng : cityMatch!.lng).toFixed(6)
    )
    const lat = parseFloat(
      (isRegionChosen ? regionMatch!.lat : cityMatch!.lat).toFixed(6)
    )
    const displayName = isRegionChosen ? regionMatch!.state : cityMatch!.city

    const coordKey = `${lng},${lat}`

    if (resultMap.has(coordKey)) {
      const existing = resultMap.get(coordKey)!
      existing.value[2] += record.clViews
      existing.value[3] += record.clHugs
      existing.value[4] += record.clMessages
    } else {
      resultMap.set(coordKey, {
        name: displayName,
        value: [lng, lat, record.clViews, record.clHugs, record.clMessages],
      })
    }
  }

  return Array.from(resultMap.values())
}
