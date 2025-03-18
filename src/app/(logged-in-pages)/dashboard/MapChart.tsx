'use client'
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import useDeviceSize from '@/app/hooks/useDeviceSize'

const WorldMap = () => {
  const [option, setOption] = useState({})
  const deviceSize = useDeviceSize()

  useEffect(() => {
    // Fetch world map JSON
    fetch('/maps/world.json')
      .then((res) => res.json())
      .then((worldJson) => {
        echarts.registerMap('world', worldJson) // Register map

        setOption({
          tooltip: {
            trigger: 'item',
            borderColor: '#5470C6',
            formatter: (params: {
              name: string
              value?: number | [number, number, number]
              seriesName: string
            }) =>
              `${params.name}: ${
                Array.isArray(params.value) ? params.value[2] : 'No data'
              }`,
          },
          geo: {
            map: 'world',
            roam: false, // Enable zoom and pan

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
              data: [
                { name: 'New York', value: [-74.006, 40.7128, 120] },
                { name: 'London', value: [-0.1276, 51.5074, 200] },
                { name: 'Tokyo', value: [139.6917, 35.6895, 300] },
                { name: 'Manila', value: [120.9842, 14.5995, 180] },
              ],
              //   symbolSize: (val: [number, number, number]) =>
              //     Math.sqrt(val[2]) * 2, // Adjust size based on value
              itemStyle: {
                color: '#63B6AC',
              },
            },
          ],
        })
      })
  }, [])

  return (
    <ReactECharts
      option={option}
      style={{
        height: `${deviceSize === 'sm' ? '170px' : '370px'}`,
        width: '100%',
      }}
    />
  )
}

export default WorldMap
