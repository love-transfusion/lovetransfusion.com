'use client'
import useTooltip from '@/app/hooks/this-website-only/useTooltips'
import React from 'react'

interface MapTooltipTypes {
  user_id: string
}

const MapTooltip = ({ user_id }: MapTooltipTypes) => {
  const { Tooltip } = useTooltip({
    clTooltipTitle: 'Awareness',
    clUser_id: user_id,
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
