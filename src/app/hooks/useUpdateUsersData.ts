'use client'
import { useEffect } from 'react'
import { fetchDataFromLTOrg_and_upsertto_users_data_website } from '../_actions/orgRecipients/actions'

const useUpdateUsersData = (recipientId: string, userID: string) => {
  console.log({ userID })
  const updateRecipient = () => {
    if (recipientId) {
      console.log({ recipientId })
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

export default useUpdateUsersData
