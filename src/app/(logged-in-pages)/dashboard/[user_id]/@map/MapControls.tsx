'use client'
import Icon_negative from '@/app/components/icons/Icon_negative'
import Icon_plus from '@/app/components/icons/Icon_plus'
import Icon_refresh from '@/app/components/icons/Icon_refresh'
import useTooltip from '@/app/hooks/this-website-only/useTooltips'
import React from 'react'

interface MapControlsTypes {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartRef: React.RefObject<any>
  user_id: string
}

const MapControls = ({ chartRef, user_id }: MapControlsTypes) => {
  const { Tooltip } = useTooltip({
    clTooltipTitle: 'Controls',
    clUser_id: user_id,
  })

  const handleZoom = (delta: number) => {
    const instance = chartRef.current?.getEchartsInstance()
    if (!instance) return

    const currentZoom = instance.getOption()?.geo?.[0]?.zoom || 1
    const newZoom = Math.max(1, Math.min(currentZoom + delta, 10))

    instance.setOption({
      geo: [{ zoom: newZoom }],
    })
  }

  const handleReset = () => {
    const instance = chartRef.current?.getEchartsInstance()
    instance?.dispatchAction({ type: 'restore' })
  }
  return (
    <div
      className={
        'absolute top-4 md:top-8 lg:top-4 right-[10px] md:right-0 lg:right-4'
      }
    >
      <Tooltip>
        <div className="space-y-2 bg-white shadow p-1 md:p-2 rounded z-50">
          <div
            onClick={() => handleZoom(0.2)}
            className={
              'min-w-5 min-h-5 max-w-5 max-h-5 lg:min-w-7 lg:min-h-7 lg:max-w-7 lg:max-h-7 bg-primary-50 shadow flex items-center justify-center rounded-full cursor-pointer'
            }
            title="Zoom In"
          >
            <Icon_plus className="text-primary" />
          </div>
          <div
            onClick={() => handleZoom(-0.2)}
            className={
              'min-w-5 min-h-5 max-w-5 max-h-5 lg:min-w-7 lg:min-h-7 lg:max-w-7 lg:max-h-7 bg-primary-50 shadow flex items-center justify-center rounded-full cursor-pointer'
            }
            title="Zoom Out"
          >
            <Icon_negative className="text-primary mt-1" />
          </div>
          <div
            onClick={handleReset}
            className={
              'min-w-5 min-h-5 max-w-5 max-h-5 lg:min-w-7 lg:min-h-7 lg:max-w-7 lg:max-h-7 bg-primary-50 shadow flex items-center justify-center rounded-full cursor-pointer'
            }
            title="Reset"
          >
            <Icon_refresh className="text-primary" />
          </div>
        </div>
      </Tooltip>
    </div>
  )
}

export default MapControls
