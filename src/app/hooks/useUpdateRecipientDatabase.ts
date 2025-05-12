'use client'
import { useEffect } from 'react'
import { fetchDataFromLTOrg_and_upsertto_users_data_website } from '../_actions/orgRecipients/actions'

const useUpdateRecipientDatabase = (recipientId: string) => {
  const updateRecipient = () => {
    if (recipientId) {
      fetchDataFromLTOrg_and_upsertto_users_data_website(recipientId)
    }
  }

  useEffect(() => {
    updateRecipient()
    const interval = setInterval(() => updateRecipient(), 15 * 60 * 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return
}

export default useUpdateRecipientDatabase
