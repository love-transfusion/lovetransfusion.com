'use client'
import useTooltip from '@/app/hooks/this-website-only/useTooltips'
import React from 'react'

interface MostRecentEngagementContainerTypes {
  children: React.ReactNode
  user_id: string
}

const MostRecentEngagementContainer = ({
  children,
  user_id,
}: MostRecentEngagementContainerTypes) => {
  const { Tooltip } = useTooltip({
    clTooltipTitle: 'Supporters',
    clUser_id: user_id,
  })
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
