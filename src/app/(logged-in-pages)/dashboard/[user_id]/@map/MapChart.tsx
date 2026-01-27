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
import useDeviceSize from '@/app/hooks/useDeviceSize'
import TapToExploreMap from './TapToExploreMap'

interface Props {
  user_id: string
  prepared_analytics: I_CountryPathTotalFormat[]
  recipient_template: 'original' | 'church'
}

const defaultPoint: I_CountryPathTotalFormat[] = [
  {
    cl_city: 'Ashburn',
    cl_region: 'Virginia',
    cl_country: 'United States',
    cl_country_code: 'US',
    clViews: 1,
    clHugs: 0,
    clMessages: 0,
    cl_source: 'Website',
  },
]

const MapChart = ({
  user_id,
  prepared_analytics,
  recipient_template,
}: Props) => {
  const [analytics, setanalytics] =
    useState<I_CountryPathTotalFormat[]>(prepared_analytics)
  const [option, setOption] = useState<any>({ series: [] })
  const [mappedData, setMappedData] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { clWindowWidth } = useDeviceSize()

  const chartRef = useRef<any>(null)
  const intersectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const loadMap = async () => {
      if (mappedData.length < 1) setLoading(true)

      const res = await fetch('/maps/world_detailed_level2.json', {
        cache: 'force-cache',
      })
      const worldJson = await res.json()
      registerMap('world', worldJson)

      const combinedAnalytics = [...analytics, ...defaultPoint]
      console.log({ combinedAnalytics })

      // Remove item with hugs and messages
      const removedHugsAndMessages = combinedAnalytics.filter(
        (item) => item.clViews,
      )

      const mapped = await mapAnalyticsToGeoPoints(removedHugsAndMessages)
      setMappedData(mapped)

      const calculateSymbolSize = (val: any[]) => {
        const total = val[2]
        if (clWindowWidth > 768) {
          if (total <= 5) return 2
          if (total <= 99) return 3
          if (total <= 999) return 4
          if (total <= 4999) return 6
          if (total <= 9999) return 8
          return 10 // 10,000+
        } else {
          if (total <= 5) return 1
          if (total <= 99) return 2
          if (total <= 999) return 3
          if (total <= 4999) return 4
          if (total <= 9999) return 5
          return 6 // 10,000+
        }
      }

      setOption({
        tooltip: {
          trigger: 'item',
          padding: 0,
          borderColor: '#2F8EDD',
          extraCssText:
            'max-width: 266px; white-space: normal; word-wrap: break-word; border-top: 10px solid #2F8EDD; padding: 5px 14px; color: #000',
          position: function (
            point: [any, any],
            params: any,
            dom: { offsetWidth: number; offsetHeight: number },
            rect: any,
            size: { viewSize: any[] },
          ) {
            const [x, y] = point
            const tipW = dom?.offsetWidth || 266
            const tipH = dom?.offsetHeight || 72
            const viewW = size.viewSize[0]
            const offsetY = 16 // distance above the symbol

            // Position horizontally centered above the point
            let left = x - tipW / 2
            let top = y - tipH - offsetY

            // ✅ Clamp horizontally within viewport
            left = Math.max(8, Math.min(left, viewW - tipW - 8))

            // ✅ Allow vertical overflow (don’t clamp top)
            // If you prefer always above, keep top as-is
            // If it goes beyond top of viewport, move it below instead:
            if (top < 0) {
              top = y + offsetY // place below the symbol if too high
            }

            return [left, top]
          },
          formatter: (params: {
            name: string
            value?: GeoPoint['value']
            seriesName: string
          }) => {
            if (Array.isArray(params.value)) {
              const [, , views] = params.value
              const peopleText = views > 1 ? 'people' : 'person'

              let message
              switch (params.value[3]) {
                case 'Facebook':
                  message = `Your story has been seen by <strong>${views}</strong> people in <strong>${params.name}</strong>`
                  break
                case 'Website':
                  message = `<strong>${views}</strong> ${peopleText} in <strong>${params.name}</strong> visited your Love Transfusion page.`
                default:
                  break
              }

              const iconSVG = `
      <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1185_1864)">
          <path
            d="M12.5033 11.8538C14.2078 11.8538 15.5914 10.3833 15.5914 8.57193C15.5914 6.76053 14.2078 5.29003 12.5033 5.29003C10.7989 5.29003 9.41529 6.76053 9.41529 8.57193C9.41529 10.3833 10.7989 11.8538 12.5033 11.8538ZM13.6062 12.6626H11.3938C9.06771 12.6626 7.1828 14.5475 7.1828 16.8736V20.9576C10.6786 21.519 14.3147 21.519 17.8105 20.9576V16.8736C17.8105 14.5475 15.9256 12.6626 13.5995 12.6626H13.6062ZM20.1366 10.7576H18.1113C16.8747 10.7576 15.7786 11.3391 15.07 12.2415C17.0352 12.8631 18.4656 14.7079 18.4656 16.8736V18.7451C20.3237 18.7852 22.1819 18.6582 24 18.3641V14.6144C24 12.4821 22.2688 10.7509 20.1366 10.7509V10.7576ZM19.1206 10.0157C20.6847 10.0157 21.9547 8.6655 21.9547 7.00785C21.9547 5.35019 20.6847 4 19.1206 4C17.5565 4 16.2865 5.35019 16.2865 7.00785C16.2865 8.6655 17.5565 10.0157 19.1206 10.0157ZM5.8794 10.0157C7.44348 10.0157 8.71346 8.6655 8.71346 7.00785C8.71346 5.35019 7.44348 4 5.8794 4C4.31532 4 3.03865 5.35019 3.03865 7.00785C3.03865 8.6655 4.30863 10.0157 5.87271 10.0157H5.8794ZM9.92996 12.2415C9.22145 11.3391 8.12525 10.7576 6.8887 10.7576H4.86341C2.73118 10.7576 1 12.4888 1 14.621V18.3708C2.81808 18.6649 4.68294 18.7919 6.53444 18.7518V16.8803C6.53444 14.7079 7.96484 12.8698 9.92996 12.2482V12.2415Z"
            fill="#fff"
          />
        </g>
        <defs>
          <clipPath id="clip0_1185_1864">
            <rect width="23" height="17.3787" fill="white" transform="translate(1 4)" />
          </clipPath>
        </defs>
      </svg>
    `
              return `
              <div style="display: flex; gap: 8px;"> <div style="min-width: 30px; min-height: 30px; max-width: 30px; max-height: 30px; padding: 4px; background-color: #2F8FDD; display: flex; justify-content: center; align-items: center; border-radius: 100px;">${iconSVG}</div>
              <p>${message}</p>
              </div>
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
          scaleLimit: {
            min: 1,
            max: recipient_template === 'church' ? 100 : 20,
          },
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
    if (clWindowWidth) {
      loadMap()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clWindowWidth])

  useEffect(() => {
    setanalytics(prepared_analytics)
  }, [prepared_analytics])

  return (
    <div>
      {loading ? (
        <div className="echarts-for-react text-center text-gray-500 py-10">
          <LoadingComponent
            clLoadingText="Loading map..."
            // clContainerClassName="bg-white"
          />
        </div>
      ) : (
        <>
          <TapToExploreMap intersectionRef={intersectionRef} />
          <div className="relative w-full" ref={intersectionRef}>
            <ReactECharts
              ref={chartRef}
              option={option}
              style={{ width: '100%' }}
            />
            {/* Floating Controls */}
            {user_id && <MapControls chartRef={chartRef} user_id={user_id} />}
          </div>
        </>
      )}
    </div>
  )
}

export default MapChart
