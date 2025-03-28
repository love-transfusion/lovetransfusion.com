'use client'
import useUpdateRecipientDatabase from '@/app/hooks/useUpdateRecipientDatabase'
import React from 'react'
import { I_userData } from '../actions'

const ClientUpdate = ({ userData }: { userData: I_userData}) => {
  useUpdateRecipientDatabase(userData)
  return <div></div>
}

export default ClientUpdate
