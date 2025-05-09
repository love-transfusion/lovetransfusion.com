import React from 'react'
import ClientUpdate from './ClientUpdate'
import { supa_select_recipient } from '@/app/_actions/users_data_website/actions'

type Params = Promise<{ user_id: string }>

const UpdateSlot = async (props: { params: Params }) => {
  const { user_id } = await props.params
  const { data: recipientRow } = await supa_select_recipient(user_id)
  if (!recipientRow) return
  const unkRecipientObj = recipientRow?.recipient as unknown
  const recipientObj =
    unkRecipientObj as I_supaorg_recipient_hugs_counters_comments
  return (
    <ClientUpdate
      recipientId={recipientObj.id}
    />
  )
}

export default UpdateSlot
