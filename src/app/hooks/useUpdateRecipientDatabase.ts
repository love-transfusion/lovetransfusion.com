import { useEffect } from 'react'
import { I_userData } from '../(logged-in-pages)/dashboard/[user_id]/actions'
import { supa_admin_upsert_list_of_recipients } from '../admin/(with-navigation)/actions'

const useUpdateRecipientDatabase = (userData: I_userData) => {
  console.log({ userData })
  const updateRecipient = async () => {
    await supa_admin_upsert_list_of_recipients([
      {
        id: userData.recipient.id,
        recipient: userData.recipient,
      },
    ])
  }
  useEffect(() => {
    updateRecipient()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return
}

export default useUpdateRecipientDatabase
