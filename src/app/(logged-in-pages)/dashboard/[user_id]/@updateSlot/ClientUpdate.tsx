'use client'
import useToolTipFetchLazilyOrInsertTooltips from '@/app/hooks/this-website-only/useToolTipFetchLazilyOrInsertTooltips'
import useUpdateRecipientDatabase from '@/app/hooks/useUpdateRecipientDatabase'
import React from 'react'

const ClientUpdate = ({ recipientId }: { recipientId: string }) => {
  useToolTipFetchLazilyOrInsertTooltips({ clPath: '/dashboard' })
  useUpdateRecipientDatabase(recipientId)
  return <div></div>
}

export default ClientUpdate
