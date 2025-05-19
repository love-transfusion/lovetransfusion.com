'use server'

import { I_CountryPathTotalFormat } from './getAnalyticsCountryPathTotal'
import rawCities from '@/app/lib/geonames/cities.json'

type CityEntry = {
  city: string
  country: string | null
  state: string
  lat: number
  lng: number
}

const cities = rawCities as Record<string, CityEntry>

export type GeoPoint = {
  name: string
  value: [number, number, number, number, number] // [lng, lat, views, hugs, messages]
}

const formatReadyToSearchRemoveCity = (str: string) => {
  return str
    ?.replaceAll(/\bcity\b/gi, '')
    .replaceAll(' ', '')
    .trim()
    .toLowerCase()
}

// 🧠 Pre-index for instant lookup
const cityMap = new Map<string, CityEntry>()
const regionMap = new Map<string, CityEntry>()

for (const key of Object.keys(cities)) {
  const entry = cities[key]
  const cityKey = `${formatReadyToSearchRemoveCity(entry.city)}_${key.slice(-2).toLowerCase()}`
  cityMap.set(cityKey, entry)

  const regionKey = `${formatReadyToSearchRemoveCity(entry.state)}_${key.slice(-2).toLowerCase()}`
  if (entry.state) {
    regionMap.set(regionKey, entry)
  }
}

export const mapAnalyticsToGeoPoints = async (
  analytics: I_CountryPathTotalFormat[]
): Promise<GeoPoint[]> => {
  const resultMap = new Map<string, GeoPoint>()
  console.time('geoMappingLoop')

  for (const entry of analytics) {
    const rawCity = entry.cl_city || ''
    const rawRegion = entry.cl_region || ''
    const countryCode = formatReadyToSearchRemoveCity(entry.cl_country_code || '')
    const city = formatReadyToSearchRemoveCity(rawCity)
    const region = formatReadyToSearchRemoveCity(rawRegion)

    const isCityUnset =
      !rawCity || rawCity.trim().toLowerCase() === '(not set)' || city === '' || city === '(notset)'

    // Fast O(1) match
    console.time('cityExactMatch')
    const matchFromCity = cityMap.get(`${city}_${countryCode}`)
    console.timeEnd('cityExactMatch')

    let match = matchFromCity

    // Fallback to region if needed
    if (!match && (isCityUnset || city)) {
      console.time('regionFallbackMatch')
      match = regionMap.get(`${region}_${countryCode}`)
      console.timeEnd('regionFallbackMatch')
    }

    if (!match) continue

    const lng = parseFloat(match.lng.toFixed(6))
    const lat = parseFloat(match.lat.toFixed(6))
    const key = `${lng},${lat}`

    if (resultMap.has(key)) {
      const existing = resultMap.get(key)!
      existing.value[2] += entry.clViews
      existing.value[3] += entry.clHugs
      existing.value[4] += entry.clMessages
    } else {
      resultMap.set(key, {
        name: match.city,
        value: [lng, lat, entry.clViews, entry.clHugs, entry.clMessages],
      })
    }
  }

  console.timeEnd('geoMappingLoop')
  return Array.from(resultMap.values())
}
