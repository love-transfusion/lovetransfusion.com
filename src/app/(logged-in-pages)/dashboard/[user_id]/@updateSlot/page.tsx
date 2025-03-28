import { fetchDataFromLTOrg } from '@/app/admin/(with-navigation)/actions'
import React from 'react'
import { supa_select_recipient } from '../actions'
import ClientUpdate from './ClientUpdate'

type Params = Promise<{ user_id: string }>

const UpdateSlot = async (props: { params: Params }) => {
  const { user_id } = await props.params
  const { data: recipientRow } = await supa_select_recipient(user_id)
  if (!recipientRow) return
  const unkRecipientObj = recipientRow?.recipient as unknown
  const recipientObj =
    unkRecipientObj as I_supaorg_recipient_hugs_counters_comments

  const newOrgRecipientData: {
    recipients: I_supaorg_recipient_hugs_counters_comments[]
  } = await fetchDataFromLTOrg(recipientObj.id)

  if (!newOrgRecipientData.recipients) return
  return (
    <ClientUpdate
      userData={{
        recipient: newOrgRecipientData.recipients[0],
        id: user_id,
      }}
    />
  )
}

export default UpdateSlot
