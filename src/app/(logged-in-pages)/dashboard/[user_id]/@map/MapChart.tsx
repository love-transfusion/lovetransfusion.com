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
  const [option, setOption] = useState<any>({ series: [] })
  const [mappedData, setMappedData] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadMap = async () => {
      if (mappedData.length < 1) setLoading(true)

      const res = await fetch('/maps/world.json')
      const worldJson = await res.json()
      registerMap('world', worldJson)

      // Fetch analytics
      const clGoogleAnalytics = await ga_selectGoogleAnalyticsData({
        clSpecificPath: `/${recipientObj.path_url}`,
      })

      const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
        clGoogleAnalytics,
        clRecipient: recipientObj,
      })

      const facebookAdData = selectedUser?.fb_ad_id
        ? await util_fetchAdWiseInsights({ ad_id: selectedUser?.fb_ad_id })
        : []

      const formattedFacebookData = facebookAdData.map((fbdata) => {
        const {
          cl_region,
          cl_country,
          cl_country_code,
          cl_city,
          cl_total_reactions,
          cl_impressions,
        } = fbdata
        return {
          cl_region,
          cl_country,
          cl_country_code,
          cl_city,
          clViews: cl_impressions,
          clMessages: 0,
          clHugs: cl_total_reactions,
        }
      })

      const combinedAnalytics = [
        ...analyticsWithCountryPathTotal,
        ...formattedFacebookData,
      ]

      const mapped = await mapAnalyticsToGeoPoints(combinedAnalytics || [])
      setMappedData(mapped)

      // 🧠 Calculate min/max
      const totals = mapped.map((d) => d.value[3] + d.value[4])
      const minTotal = Math.min(...totals)
      const maxTotal = Math.max(...totals)

      const calculateSymbolSize = (val: any[]) => {
        const total = val[3] + val[4]
        const minSize = 5
        const maxSize = 20

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
              const [, , views, hugs, messages] = params.value
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
          roam: true,
          zoom: 1.2,
          layoutSize: '100%',
          label: { show: false },
          scaleLimit: { min: 1, max: 10 },
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
            data: mapped,
            itemStyle: { color: '#63B6AC' },
            symbolSize: calculateSymbolSize,
          },
        ],
      })

      setLoading(false)
    }

    loadMap()
  }, [recipientObj, selectedUser])

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
