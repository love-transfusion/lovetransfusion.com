'use client'
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { registerMap } from 'echarts/core'
import { GeoPoint } from '@/app/utilities/analytics/mapAnalyticsToGeoPoints'

interface I_MapChart {
  mappedData: GeoPoint[] | undefined
}
type I_Parameters = [number, number, number, number, number] // [lon, lat, views, hugs, messages]

const MapChart = ({ mappedData }: I_MapChart) => {
  const [option, setOption] = useState({})

  useEffect(() => {
    fetch('/maps/world.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load map JSON')
        return res.json()
      })
      .then((worldJson) => {
        registerMap('world', worldJson) // Register map

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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [lon, lat, views, hugs, messages] = params.value
                return `
                  <strong>${params.name}</strong><br/>
                  views: ${views}<br/>
                  hugs: ${hugs}<br/>
                  messages: ${messages}
                `
              } else {
                return `<strong>${params.name}</strong><br/>No data`
              }
            },
          },
          geo: {
            map: 'world',
            roam: true, // Enable zoom and pan
            zoom: 1.2, // Adjust zoom level to fit screen
            layoutSize: '100%',
            label: {
              show: false,
            },
            scaleLimit: {
              min: 1,
              max: 2.5,
            },
            itemStyle: {
              areaColor: '#E2F2FA',
              borderColor: '#DAEBFA',
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
              data: mappedData,
              itemStyle: {
                color: '#63B6AC',
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              symbolSize: (val: any[]) => {
                const total = val[2] + val[3] + val[4] // [lng, lat, views, hugs, messages]
                const safeTotal = Math.max(total, 1) // avoid log(0)
                const size = Math.log10(safeTotal) * 10 // Log scaling
                return Math.max(5, Math.min(size, 100)) // clamp between 5 and 100
              },
            },
          ],
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ReactECharts
      option={option}
      style={{
        width: '100%',
      }}
    />
  )
}

export default MapChart
