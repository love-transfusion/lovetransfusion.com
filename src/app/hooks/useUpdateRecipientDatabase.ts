import { useEffect } from 'react'
import { I_userData } from '../(logged-in-pages)/dashboard/[user_id]/actions'
import { supa_update_recipient_data_from_org } from '../(logged-in-pages)/dashboard/[user_id]/@updateSlot/actions'

const useUpdateRecipientDatabase = (userData: I_userData) => {
  const updateRecipient = async () => {
    await supa_update_recipient_data_from_org(userData)
  }
  useEffect(() => {
    updateRecipient()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return
}

export default useUpdateRecipientDatabase
