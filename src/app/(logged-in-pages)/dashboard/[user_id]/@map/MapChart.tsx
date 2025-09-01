/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// ECharts core (tree-shakable)
import * as echarts from 'echarts/core'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { EffectScatterChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { registerMap } from 'echarts/core'
import type { ECharts, EChartsOption } from 'echarts'

// Register minimal pieces once
echarts.use([GeoComponent, TooltipComponent, EffectScatterChart, CanvasRenderer])

// Dynamically load wrapper
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="h-[170px] md:h-[370px] grid place-items-center text-gray-500">
      Loading map…
    </div>
  ),
})

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

// ---------- map registration cache ----------
let WORLD_JSON_PROMISE: Promise<any> | null = null
let WORLD_REGISTERED = false
async function ensureWorldRegistered(signal?: AbortSignal) {
  if (WORLD_REGISTERED) return
  if (!WORLD_JSON_PROMISE) {
    WORLD_JSON_PROMISE = fetch('/maps/world.json', {
      cache: 'force-cache',
      signal,
    }).then((r) => r.json())
  }
  const worldJson = await WORLD_JSON_PROMISE
  if (signal?.aborted) return
  registerMap('world', worldJson as any)
  WORLD_REGISTERED = true
}
// --------------------------------------------

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
  const [mappedData, setMappedData] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const chartRef = useRef<ECharts | null>(null)

  // ✅ prevent re-flicker: only show loader on first load
  const loadedOnceRef = useRef(false)

  useEffect(() => {
    const ac = new AbortController()
    let aborted = false

    const loadMap = async () => {
      // Only set the spinner on the very first load
      if (!loadedOnceRef.current) setLoading(true)

      // register map (aborts if unmounted)
      await ensureWorldRegistered(ac.signal)
      if (aborted || ac.signal.aborted) return

      // fetch analytics in parallel (server functions; cannot be aborted client-side)
      const [clGoogleAnalytics, fbResp] = await Promise.all([
        ga_selectGoogleAnalyticsData({
          clSpecificPath: `/${recipientObj.path_url}`,
        }),
        util_multiple_fetchAdWiseInsights(
          (selectedUser?.fb_ad_IDs as unknown as string[]) ?? []
        ),
      ])
      if (aborted || ac.signal.aborted) return

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
      ].filter((item) => item.clViews)

      const mapped = await mapAnalyticsToGeoPoints(combinedAnalytics)
      if (aborted || ac.signal.aborted) return

      setMappedData(mapped)
      setLoading(false)
      loadedOnceRef.current = true
    }

    loadMap()

    return () => {
      aborted = true
      ac.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientObj.path_url, selectedUser?.fb_ad_IDs])

  // 👉 derive option with useMemo
  const option: EChartsOption = useMemo(() => {
    if (loading || mappedData.length === 0) return { series: [] }

    const totals = mappedData.map((d) => d.value[3] + d.value[4])
    const minTotal = Math.min(...totals)
    const maxTotal = Math.max(...totals)

    const calculateSymbolSize = (val: number[]) => {
      const total = val[3] + val[4]
      const minSize = 5
      const maxSize = 20
      if (maxTotal === minTotal) return (minSize + maxSize) / 2
      const normalized = (total - minTotal) / (maxTotal - minTotal)
      return minSize + normalized * (maxSize - minSize)
    }

    const tooltipFormatter = (params: any): string => {
      const p = Array.isArray(params) ? params[0] : params
      const val = p.value as unknown
      const arr = Array.isArray(val) ? (val as number[]) : undefined
      const views = arr ? arr[2] : undefined
      return arr
        ? `<strong>${p.name}</strong><br/>views: ${views}`
        : `<strong>${p.name}</strong><br/>No data`
    }

    return {
      tooltip: {
        trigger: 'item',
        borderColor: '#5470C6',
        formatter: tooltipFormatter,
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
          data: mappedData,
          itemStyle: { color: '#4caf50' },
          symbolSize: calculateSymbolSize,
        },
      ],
    }
  }, [mappedData, loading])

  // ✅ Memoize MapControls element (no rerender on option changes)
  const controls = useMemo(
    () =>
      selectedUser?.id ? (
        <MapControls chartRef={chartRef} user_id={selectedUser.id} />
      ) : null,
    [selectedUser?.id] // chartRef object identity is stable
  )

  return (
    <>
      {loading ? (
        <div className="echarts-for-react text-center text-gray-500 py-10">
          <LoadingComponent clLoadingText="Loading map..." />
        </div>
      ) : (
        <div className="relative w-full">
          <ReactECharts
            option={option}
            style={{ width: '100%' }}
            onChartReady={(chart) => {
              chartRef.current = chart
            }}
          />
          {controls}
        </div>
      )}
    </>
  )
}

export default MapChart
