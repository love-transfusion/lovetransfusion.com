'use server'
import fs from 'fs'
import path from 'path'
import { I_CountryPathTotalFormat } from './getAnalyticsCountryPathTotal'

type CityEntry = {
  city: string
  country: string | null
  state: string
  lat: number
  lng: number
}

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
  const filePath = path.join(process.cwd(), 'src/app/lib/geonames/cities.json')
  const cities = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<
    string,
    CityEntry
  >

  const resultMap = new Map<string, GeoPoint>()

  for (const entry of analytics) {
    const rawCity = entry.clCity || ''
    const city = formatReadyToSearchRemoveCity(rawCity)
    const countryCode = formatReadyToSearchRemoveCity(entry.clCountryCode || '')

    const isCityUnset =
      !rawCity ||
      rawCity.trim().toLowerCase() === '(not set)' ||
      city === '' ||
      city === '(notset)'

    const matchedKey = Object.keys(cities).find((key) => {
      const lowerCasedKey = key.slice(0, key.length - 3).toLowerCase()
      const theKey = formatReadyToSearchRemoveCity(lowerCasedKey)
      const countryCodeKey = key.slice(-2).toLowerCase()

      if (theKey === city && countryCodeKey === countryCode) return true
      if (isCityUnset && countryCodeKey === countryCode) return true

      return false
    })

    if (!matchedKey) continue

    const match = cities[matchedKey]
    const lng = parseFloat(match.lng.toFixed(6))
    const lat = parseFloat(match.lat.toFixed(6))
    const key = `${lng},${lat}` // use lng-lat as a unique key

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

  const result = Array.from(resultMap.values())
  return result
}
