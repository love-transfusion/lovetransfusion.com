/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { registerMap } from 'echarts/core'
import {
  GeoPoint,
  mapAnalyticsToGeoPoints,
} from '@/app/utilities/analytics/mapAnalyticsToGeoPoints'
import { ga_selectGoogleAnalyticsData } from '@/app/utilities/analytics/googleAnalytics'
import getAnalyticsCountryPathTotal from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'
import LoadingComponent from '@/app/components/Loading'
import { util_multiple_fetchAdWiseInsights } from '@/app/utilities/facebook/util_facebookApi'
import MapControls from './MapControls'

interface Props {
  recipientObj: I_supaorg_recipient_hugs_counters_comments
  selectedUser: I_supa_users_with_profpic_dataweb | null
}
type I_Parameters = [number, number, number, number, number]

// ---------- module-scope cache/guard (prevents re-fetch + re-register) ----------
let WORLD_JSON_PROMISE: Promise<any> | null = null
let WORLD_REGISTERED = false
async function ensureWorldRegistered() {
  if (WORLD_REGISTERED) return
  if (!WORLD_JSON_PROMISE) {
    WORLD_JSON_PROMISE = fetch('/maps/world.json', {
      cache: 'force-cache',
    }).then((r) => r.json())
  }
  const worldJson = await WORLD_JSON_PROMISE
  registerMap('world', worldJson as any)
  WORLD_REGISTERED = true
}
// ------------------------------------------------------------------------------

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

const MapChart = ({ recipientObj, selectedUser }: Props) => {
  const [option, setOption] = useState<any>({ series: [] })
  const [mappedData, setMappedData] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    const loadMap = async () => {
      if (mappedData.length < 1) setLoading(true)

      // ✅ fetch + register only once per session
      await ensureWorldRegistered()

      // Fetch analytics
      const [clGoogleAnalytics, fbResp] = await Promise.all([
        ga_selectGoogleAnalyticsData({
          clSpecificPath: `/${recipientObj.path_url}`,
        }),
        util_multiple_fetchAdWiseInsights(
          (selectedUser?.fb_ad_IDs as unknown as string[]) ?? []
        ),
      ])

      const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
        clGoogleAnalytics,
        clRecipient: recipientObj,
      })

      const formattedFacebookData =
        (fbResp.data ?? []).map((fbdata) => ({
          cl_region: fbdata.cl_region,
          cl_country: fbdata.cl_country,
          cl_country_code: fbdata.cl_country_code,
          cl_city: fbdata.cl_city,
          clViews: fbdata.cl_impressions,
          clMessages: 0,
          clHugs: fbdata.cl_total_reactions,
        })) ?? []

      const combinedAnalytics = [
        ...analyticsWithCountryPathTotal,
        ...formattedFacebookData,
        ...defaultPoint,
      ]

      const removedHugsAndMessages = combinedAnalytics.filter(
        (item) => item.clViews
      )

      const mapped = await mapAnalyticsToGeoPoints(removedHugsAndMessages || [])
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

      // ❗ layout/style unchanged from your version
      setOption({
        tooltip: {
          trigger: 'item',
          borderColor: '#5470C6',
          formatter: (params: { name: string; value?: I_Parameters }) => {
            if (Array.isArray(params.value)) {
              const [, , views] = params.value
              return `<strong>${params.name}</strong><br/>views: ${views}<br/>`
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
          itemStyle: { areaColor: '#E2F2FA', borderColor: '#DAEBFA' },
          emphasis: {
            label: { show: false },
            itemStyle: { areaColor: '#A5D8FF' },
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
  }, [recipientObj.path_url, selectedUser?.fb_ad_IDs]) // ⬅️ tightened deps

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
          {selectedUser?.id && (
            <MapControls chartRef={chartRef} user_id={selectedUser.id} />
          )}
        </div>
      )}
    </>
  )
}

export default MapChart
