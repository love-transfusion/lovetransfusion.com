// components/RippleMarker.tsx
'use client'

import { OverlayView } from '@react-google-maps/api'

type Props = {
  lat: number
  lng: number
  total?: number // hugs/messages/etc for sizing
}

export function RippleMarker({ lat, lng, total = 1 }: Props) {
  const position = { lat, lng }

  // scale radius based on "total" (optional)
  const size = Math.min(40, 10 + total * 2) // px

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)', // center the marker
          width: size,
          height: size,
        }}
      >
        {/* solid center circle */}
        <div className="w-full h-full rounded-full bg-emerald-500 opacity-80" />

        {/* expanding ring */}
        <div className="pointer-events-none absolute inset-0 rounded-full border border-emerald-500 animate-pulse-ripple" />
      </div>
    </OverlayView>
  )
}
