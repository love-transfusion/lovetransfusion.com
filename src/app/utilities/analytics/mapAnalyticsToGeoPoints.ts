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

/**
 * Normalize a location string (city, state, or country) for search.
 * - Removes the word "city"
 * - Removes spaces
 * - Trims whitespace
 * - Lowercases everything
 */
const normalizeLocationKey = (str: string) => {
  return str
    ?.replaceAll(/\bcity\b/gi, '')
    .replaceAll(' ', '')
    .trim()
    .toLowerCase()
}

// 🧠 Pre-index for instant lookup
const cityLookup = new Map<string, LocationEntry>()
const regionLookup = new Map<string, LocationEntry>()

for (const key of Object.keys(geoDataset)) {
  const entry = geoDataset[key]

  const cityKey = `${normalizeLocationKey(entry.city)}_${key
    .slice(-2)
    .toLowerCase()}`
  cityLookup.set(cityKey, entry)

  if (entry.state) {
    const regionKey = `${normalizeLocationKey(entry.state)}_${key
      .slice(-2)
      .toLowerCase()}`
    regionLookup.set(regionKey, entry)
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

    // Try city first
    const cityMatch = cityLookup.get(`${normalizedCityKey}_${countryCodeKey}`)
    let matchedEntry = cityMatch

    // Fall back to region if no city or unusable
    if (!matchedEntry && (isCityMissing || !cityMatch)) {
      matchedEntry = regionLookup.get(
        `${normalizedRegionKey}_${countryCodeKey}`
      )
    }

    if (!matchedEntry) continue

    const lng = parseFloat(matchedEntry.lng.toFixed(6))
    const lat = parseFloat(matchedEntry.lat.toFixed(6))
    const coordKey = `${lng},${lat}`

    if (resultMap.has(coordKey)) {
      const existing = resultMap.get(coordKey)!
      existing.value[2] += record.clViews
      existing.value[3] += record.clHugs
      existing.value[4] += record.clMessages
    } else {
      resultMap.set(coordKey, {
        name: matchedEntry.city,
        value: [lng, lat, record.clViews, record.clHugs, record.clMessages],
      })
    }
  }

  return Array.from(resultMap.values())
}
