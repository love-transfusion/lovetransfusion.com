import React from 'react'
import { supa_select_recipient } from './actions'
import MembersLayout from '../../MembersLayout'

// interface I_MembersLayout

const UserIDLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ user_id: string }>
}) => {
  const { user_id } = await params
  const { data: recipientRow } = await supa_select_recipient(user_id)
  if (!recipientRow) return
  const unkRecipientObj = recipientRow?.recipient as unknown
  const recipientObj =
    unkRecipientObj as I_supaorg_recipient_hugs_counters_comments
  return (
    <>
      <MembersLayout
        childrenData={children}
        recipientRow={recipientRow}
        recipientObj={recipientObj}
      />
    </>
  )
}

export default UserIDLayout
