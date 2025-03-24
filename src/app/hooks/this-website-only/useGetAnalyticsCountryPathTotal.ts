'use client'

import { useEffect, useState } from 'react'

interface I_data {
  clPath: string
  clCountry: string
  clTotalScreenPageViews: number
}

const useGetAnalyticsCountryPathTotal = (data: I_AnalyticsData) => {
  const [clData, setdata] = useState<I_data[]>([])

  useEffect(() => {
    if (data.rows) {
      data.rows.map((row) => {
        console.log('row', row)
        const clPath =
          (row.dimensionValues && row.dimensionValues[0].value) ?? ''
        const clCountry =
          (row.dimensionValues && row.dimensionValues[1].value) ?? ''
        const clTotalScreenPageViews =
          (row.metricValues && parseInt(row.metricValues[0].value!)) ?? 0
        setdata((prevArray) => {
          return [...prevArray, { clPath, clCountry, clTotalScreenPageViews }]
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return clData
}

export default useGetAnalyticsCountryPathTotal
