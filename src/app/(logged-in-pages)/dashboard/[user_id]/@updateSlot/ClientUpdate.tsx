'use client'
import useUpdateRecipientDatabase from '@/app/hooks/useUpdateRecipientDatabase'
import React from 'react'
import { I_Recipient_Data } from '../actions'

const ClientUpdate = ({ userData }: { userData: I_Recipient_Data}) => {
  useUpdateRecipientDatabase(userData)
  return <div></div>
}

export default ClientUpdate
