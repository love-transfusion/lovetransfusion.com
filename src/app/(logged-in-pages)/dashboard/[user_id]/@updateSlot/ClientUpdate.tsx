'use client'
import useUpdateRecipientDatabase from '@/app/hooks/useUpdateRecipientDatabase'
import React from 'react'

const ClientUpdate = ({ recipientId }: { recipientId: string}) => {
  useUpdateRecipientDatabase(recipientId)
  return <div></div>
}

export default ClientUpdate
