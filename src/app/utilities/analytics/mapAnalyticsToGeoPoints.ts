'use server'
// import fs from 'fs'
// import path from 'path'
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

export const mapAnalyticsToGeoPoints = async (
  analytics: I_CountryPathTotalFormat[]
): Promise<GeoPoint[]> => {
  const resultMap = new Map<string, GeoPoint>()

  for (const entry of analytics) {
    const rawCity = entry.cl_city || ''
    const rawRegion = entry.cl_region || ''
    const city = formatReadyToSearchRemoveCity(rawCity)
    const countryCode = formatReadyToSearchRemoveCity(entry.cl_country_code || '')
    const region = formatReadyToSearchRemoveCity(rawRegion)

    const isCityUnset =
      !rawCity ||
      rawCity.trim().toLowerCase() === '(not set)' ||
      city === '' ||
      city === '(notset)'

    let matchedKey = Object.keys(cities).find((key) => {
      const lowerCasedKey = key.slice(0, key.length - 3).toLowerCase()
      const formattedKey = formatReadyToSearchRemoveCity(lowerCasedKey)
      const countryCodeKey = key.slice(-2).toLowerCase()

      return formattedKey === city && countryCodeKey === countryCode
    })

    // Fallback: match by region if city is missing or no match
    if (!matchedKey && (isCityUnset || city)) {
      matchedKey = Object.keys(cities).find((key) => {
        const cityEntry = cities[key]
        const countryCodeKey = key.slice(-2).toLowerCase()

        return (
          countryCodeKey === countryCode &&
          formatReadyToSearchRemoveCity(cityEntry.state) === region
        )
      })
    }

    if (!matchedKey) continue

    const match = cities[matchedKey]
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

  return Array.from(resultMap.values())
}
