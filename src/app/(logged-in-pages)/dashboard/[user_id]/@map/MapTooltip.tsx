'use client'
import useTooltip from '@/app/hooks/this-website-only/useTooltips'
import React from 'react'

const MapTooltip = () => {
  const { Tooltip } = useTooltip({
    clTooltipTitle: 'Awareness',
  })
  return (
    <>
      <Tooltip clContainerClassName="echarts-tooltip absolute">
        <div></div>
      </Tooltip>
    </>
  )
}

export default MapTooltip
