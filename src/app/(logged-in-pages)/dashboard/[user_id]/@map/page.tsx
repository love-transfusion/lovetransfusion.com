import React from 'react'
import MapChart from './MapChart'
import { supa_select_recipient } from '@/app/_actions/users_data_website/actions'
import { supa_select_user } from '@/app/_actions/users/actions'

type Params = Promise<{ user_id: string }>

const MapSlot = async ({ params }: { params: Params }) => {
  const { user_id } = await params
  const { data: selectedUser }= await supa_select_user(user_id)
  const { data: recipientRow } = await supa_select_recipient(user_id)
  if (!recipientRow) return null

  const recipientObj =
    recipientRow.recipient as I_supaorg_recipient_hugs_counters_comments

  return (
    <>
      <MapChart recipientObj={recipientObj} selectedUser={selectedUser} />
    </>
  )
}

export default MapSlot
