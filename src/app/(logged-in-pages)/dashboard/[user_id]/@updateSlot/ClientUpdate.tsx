'use client'
import { I_supa_select_user_Response_Types } from '@/app/_actions/users/actions'
import useToolTipFetchLazilyOrInsertTooltips from '@/app/hooks/this-website-only/useToolTipFetchLazilyOrInsertTooltips'
import useUpdateUsersData from '@/app/hooks/useUpdateUsersData'
import React from 'react'

interface ClientUpdate_Types {
  selectedUser: I_supa_select_user_Response_Types
}

const ClientUpdate = ({ selectedUser }: ClientUpdate_Types) => {
  useToolTipFetchLazilyOrInsertTooltips({ clPath: '/dashboard' })
  useUpdateUsersData(selectedUser.users_data_website[0].id, '')
  return <div></div>
}

export default ClientUpdate
