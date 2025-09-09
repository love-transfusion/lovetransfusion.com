'use client'
import useToolTipFetchLazilyOrInsertTooltips from '@/app/hooks/this-website-only/useToolTipFetchLazilyOrInsertTooltips'
import React from 'react'

const ClientUpdate = () => {
  useToolTipFetchLazilyOrInsertTooltips({ clPath: '/dashboard' })
  return <div></div>
}

export default ClientUpdate
