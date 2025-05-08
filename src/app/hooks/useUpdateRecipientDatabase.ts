'use client'
import { useEffect } from 'react'
import { I_Recipient_Data } from '../(logged-in-pages)/dashboard/[user_id]/actions'
import { supa_admin_upsert_list_of_recipients } from '../_actions/admin/actions'

const useUpdateRecipientDatabase = (userData: I_Recipient_Data) => {
  const updateRecipient = async () => {
    await supa_admin_upsert_list_of_recipients([
      {
        id: userData.recipient.id,
        recipient: userData.recipient,
      },
    ])
  }
  useEffect(() => {
    // This makes safe when the recipient is unpublished from .org
    if (userData.recipient?.id) {
      updateRecipient()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return
}

export default useUpdateRecipientDatabase
