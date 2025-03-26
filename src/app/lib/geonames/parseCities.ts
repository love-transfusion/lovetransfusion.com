'use server'
import fs from 'fs'
import path from 'path'

export const runParse = async () => {
  const citiesPath = path.join(process.cwd(), 'src/app/lib/geonames/cities1000.txt')
  const admin1Path = path.join(process.cwd(), 'src/app/lib/geonames/admin1CodesASCII.txt')
  const outputPath = path.join(process.cwd(), 'src/app/lib/geonames/cities.json')

  // Step 1: Parse admin1CodesASCII.txt to get region/state names
  const adminContent = fs.readFileSync(admin1Path, 'utf-8')
  const adminLines = adminContent.split('\n')

  const adminMap: Record<string, string> = {}
  for (const line of adminLines) {
    const parts = line.split('\t')
    if (parts.length >= 2) {
      const code = parts[0] // e.g., PH.00
      const name = parts[1] // e.g., Metropolitan Manila
      adminMap[code] = name
    }
  }

  // Step 2: Parse cities1000.txt and add state names
  const content = fs.readFileSync(citiesPath, 'utf-8')
  const lines = content.split('\n')

  const cityMap: Record<
    string,
    { city: string; country: string; state: string; lat: number; lng: number }
  > = {}

  for (const line of lines) {
    const parts = line.split('\t')
    if (parts.length >= 11) {
      const city = parts[1]
      const lat = parseFloat(parts[4])
      const lng = parseFloat(parts[5])
      const country = parts[8].toLowerCase()
      const admin1 = parts[10] // state/region code
      const stateCode = `${country.toUpperCase()}.${admin1}`
      const stateName = adminMap[stateCode] || ''

      const key = `${city.toLowerCase()},${country}`

      if (!isNaN(lat) && !isNaN(lng)) {
        cityMap[key] = { city, country, state: stateName, lat, lng }
      }
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(cityMap, null, 2))
}
