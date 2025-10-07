/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { registerMap } from 'echarts/core'
import {
  GeoPoint,
  mapAnalyticsToGeoPoints,
} from '@/app/utilities/analytics/mapAnalyticsToGeoPoints'
import { I_CountryPathTotalFormat } from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'
import LoadingComponent from '@/app/components/Loading'
import MapControls from './MapControls'

interface Props {
  user_id: string
  prepared_analytics: I_CountryPathTotalFormat[]
}
type I_Parameters = [number, number, number, number, number] // [lon, lat, views, hugs, messages]

const defaultPoint = [
  {
    cl_city: 'Ashburn',
    cl_region: 'Virginia',
    cl_country: 'United States',
    cl_country_code: 'US',
    clViews: 1,
    clHugs: 0,
    clMessages: 0,
  },
]

const MapChart = ({ user_id, prepared_analytics }: Props) => {
  const [option, setOption] = useState<any>({ series: [] })
  const [mappedData, setMappedData] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const chartRef = useRef<any>(null)

  useEffect(() => {
    const loadMap = async () => {
      if (mappedData.length < 1) setLoading(true)

      const res = await fetch('/maps/world_detailed_level2.json', {
        cache: 'force-cache',
      })
      const worldJson = await res.json()
      registerMap('world', worldJson)

      const combinedAnalytics = [...prepared_analytics, ...defaultPoint]

      // Remove item with hugs and messages
      const removedHugsAndMessages = combinedAnalytics.filter(
        (item) => item.clViews
      )

      const mapped = await mapAnalyticsToGeoPoints(removedHugsAndMessages)
      setMappedData(mapped)

      // 🧠 Calculate min/max
      const totals = mapped.map((d) => d.value[2])
      const minTotal = Math.min(...totals)
      const maxTotal = Math.max(...totals)

      const calculateSymbolSize = (val: any[]) => {
        const total = val[2]
        const minSize = 4
        const maxSize = 22

        if (maxTotal === minTotal) return (minSize + maxSize) / 2
        const normalized = (total - minTotal) / (maxTotal - minTotal)
        return minSize + normalized * (maxSize - minSize)
      }

      setOption({
        tooltip: {
          trigger: 'item',
          borderColor: '#5470C6',
          formatter: (params: {
            name: string
            value?: I_Parameters
            seriesName: string
          }) => {
            if (Array.isArray(params.value)) {
              // const [, , views, hugs, messages] = params.value
              const [, , views] = params.value
              return `
                <strong>${params.name}</strong><br/>
                views: ${views}<br/>
                `
              // hugs: ${hugs}<br/>
              // messages: ${messages}
            } else {
              return `<strong>${params.name}</strong><br/>No data`
            }
          },
        },
        geo: {
          map: 'world',
          roam: true,
          zoom: 1.2,
          layoutSize: '100%',
          label: { show: false },
          scaleLimit: { min: 1, max: 10 },
          itemStyle: {
            areaColor: '#E2F2FA',
            borderWidth: 0.8,
            borderColor: '#a1d5ef',
          },
          emphasis: {
            label: { show: false },
            itemStyle: {
              areaColor: '#A5D8FF',
            },
          },
        },
        series: [
          {
            name: 'Effect Points',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: mapped,
            itemStyle: { color: '#4caf50' },
            symbolSize: calculateSymbolSize,
          },
        ],
      })

      setLoading(false)
    }

    loadMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {loading ? (
        <div className="echarts-for-react text-center text-gray-500 py-10">
          <LoadingComponent clLoadingText="Loading map..." />
        </div>
      ) : (
        <div className="relative w-full">
          <ReactECharts
            ref={chartRef}
            option={option}
            style={{ width: '100%' }}
          />
          {/* Floating Controls */}
          {user_id && <MapControls chartRef={chartRef} user_id={user_id} />}
        </div>
      )}
    </>
  )
}

export default MapChart
