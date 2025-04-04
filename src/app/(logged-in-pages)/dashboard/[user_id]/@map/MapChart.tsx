'use client'
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import useDeviceSize from '@/app/hooks/useDeviceSize'
import { registerMap } from 'echarts/core'
import { GeoPoint } from '@/app/utilities/analytics/mapAnalyticsToGeoPoints'

interface I_MapChart {
  mappedData: GeoPoint[] | undefined
}
type I_Parameters = [number, number, number, number, number] // [lon, lat, views, hugs, messages]

const MapChart = ({ mappedData }: I_MapChart) => {
  const [option, setOption] = useState({})
  const { clDeviceSize, clWindowWidth } = useDeviceSize()
  useEffect(() => {
    fetch('/maps/world.json')
      .then((res) => res.json())
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
            },
          ],
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mapHeight = (clWindowWidth >= 2400 && '650px') ||
    (clWindowWidth >= 2000 && '600px') || (clWindowWidth >= 1800 && '480px') ||
    (clDeviceSize === 'sm' && '170px') ||
    '370px'
  return (
    <ReactECharts
      option={option}
      style={{
        height: mapHeight,
        width: '100%',
      }}
    />
  )
}

export default MapChart
