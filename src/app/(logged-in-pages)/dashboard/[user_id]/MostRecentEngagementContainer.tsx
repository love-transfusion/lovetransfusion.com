'use client'
import useTooltip from '@/app/hooks/this-website-only/useTooltips'
import React from 'react'

interface MostRecentEngagementContainerTypes {
  children: React.ReactNode
}

const MostRecentEngagementContainer = ({
  children,
}: MostRecentEngagementContainerTypes) => {
  const { Tooltip } = useTooltip({ clTooltipTitle: 'Supporters' })
  return (
    <div className={'relative'}>
      <Tooltip clContainerClassName="supporters-tooltip absolute top-[120px] left-[160px]">
        <></>
      </Tooltip>
      {children}
    </div>
  )
}

export default MostRecentEngagementContainer
