'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import { GeoPoint } from '@/app/utilities/analytics/mapAnalyticsToGeoPoints'

const MapChart = dynamic(() => import('./MapChart'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

export default function MapWrapper({ mappedData }: { mappedData: GeoPoint[] }) {
  return <MapChart mappedData={mappedData} />
}
