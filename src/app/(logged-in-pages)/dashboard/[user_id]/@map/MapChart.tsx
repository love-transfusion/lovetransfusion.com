/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { registerMap } from 'echarts/core'
import {
  GeoPoint,
  mapAnalyticsToGeoPoints,
} from '@/app/utilities/analytics/mapAnalyticsToGeoPoints'
import { ga_selectGoogleAnalyticsData } from '@/app/utilities/analytics/googleAnalytics'
import getAnalyticsCountryPathTotal from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'
import LoadingComponent from '@/app/components/Loading'
import { util_fetchAdWiseInsights } from '@/app/utilities/facebook/util_facebookApi'

interface Props {
  recipientObj: I_supaorg_recipient_hugs_counters_comments
  selectedUser: I_supa_users_with_profpic_dataweb | null
}
type I_Parameters = [number, number, number, number, number] // [lon, lat, views, hugs, messages]

const MapChart = ({ recipientObj, selectedUser }: Props) => {
  const [option, setOption] = useState<any>({
    series: [],
  })
  const [mappedData, setMappedData] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadMap = async () => {
      if (mappedData.length < 1) {
        setLoading(true)
      }
      const res = await fetch('/maps/world.json')
      const worldJson = await res.json()
      registerMap('world', worldJson)

      // Initial map render (no data yet)
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
            symbolSize: (val: any[]) => {
              const total = val[2] + val[3] + val[4] // [lng, lat, views, hugs, messages]
              const safeTotal = Math.max(total, 1) // avoid log(0)
              const size = Math.log10(safeTotal) * 10 // Log scaling
              return Math.max(5, Math.min(size, 100)) // clamp between 5 and 100
            },
          },
        ],
      })

      // Fetch and map data
      const clGoogleAnalytics = await ga_selectGoogleAnalyticsData({
        clSpecificPath: `/${recipientObj.path_url}`,
      })

      // Prepare data to be mapped
      const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
        clGoogleAnalytics,
        clRecipient: recipientObj,
      })

      console.log({ selectedUser })
      // fetch facebook Ad data
      const facebookAdData = selectedUser?.fb_ad_id  ? await util_fetchAdWiseInsights({
        ad_id: selectedUser?.fb_ad_id,
      }) : []
      // remove the keys that are not needed
      const ommittedFacebookAdDataArray = facebookAdData.map((fbdata) => {
        const {
          cl_region,
          cl_country,
          cl_country_code,
          cl_city,
          cl_total_reactions,
        } = fbdata
        return {
          cl_region,
          cl_country,
          cl_country_code,
          cl_city,
          clViews: 0,
          clMessages: 0,
          clHugs: cl_total_reactions,
        }
      })

      const combinedAnalytics = [
        ...analyticsWithCountryPathTotal,
        ...ommittedFacebookAdDataArray,
      ]

      const mapped = await mapAnalyticsToGeoPoints(combinedAnalytics || [])
      setMappedData(mapped)
      setLoading(false)
    }

    loadMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientObj])

  useEffect(() => {
    // Update just the series data without resetting the entire option

    setOption((prev: any) => ({
      ...prev,
      series: [
        {
          ...prev.series?.[0],
          data: mappedData,
          symbolSize: (val: any[]) => {
            const total = val[2] + val[3] + val[4]
            return Math.max(
              5,
              Math.min(Math.log10(Math.max(total, 1)) * 10, 100)
            )
          },
        },
      ],
    }))
  }, [mappedData])

  // return <ReactECharts option={option} style={{ width: '100%' }} />
  return (
    <>
      {loading ? (
        <div className="echarts-for-react text-center text-gray-500 py-10">
          <LoadingComponent clLoadingText="Loading map..." />
        </div>
      ) : (
        <ReactECharts option={option} style={{ width: '100%' }} />
      )}
    </>
  )
}

export default MapChart
