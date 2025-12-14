'use client'

import React, { useCallback } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { RippleMarker } from './RippleMarker'
import { SAMPLE_POINTS } from './samplePoints'

const WORLD_BOUNDS = {
  north: 84,
  south: -60,
  west: -179,
  east: 179,
}

export default function WorldMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds(
      { lat: WORLD_BOUNDS.south, lng: WORLD_BOUNDS.west }, // SW
      { lat: WORLD_BOUNDS.north, lng: WORLD_BOUNDS.east } // NE
    )

    // Fit the entire world INTO your 783x445 box
    map.fitBounds(bounds, 10)

    // After the fit is applied, lock things
    google.maps.event.addListenerOnce(map, 'idle', () => {
      const fittedZoom = map.getZoom() ?? 0

      map.setOptions({
        minZoom: fittedZoom, // prevents zooming out further than the full-world view
        restriction: { latLngBounds: WORLD_BOUNDS, strictBounds: true },
      })
    })
  }, [])

  if (!isLoaded) return <div>Loading…</div>

  return (
    <div className="w-[783px] h-[445px] mx-auto mt-20">
      <GoogleMap
        mapContainerStyle={{ width: '783px', height: '445px' }}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          maxZoom: 20,
        }}
      >
        {SAMPLE_POINTS.map((p) => (
          <RippleMarker
            key={p.id}
            lat={p.lat}
            lng={p.lng}
            total={p.hugs_count + p.messages_count + p.shares_count}
          />
        ))}
      </GoogleMap>
    </div>
  )
}
