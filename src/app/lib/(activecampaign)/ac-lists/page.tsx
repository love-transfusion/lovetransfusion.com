import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import React from 'react'
import { isAdmin } from '../../adminCheck'
import { ac_retrieveAllLists } from '@/app/utilities/activeCampaignFunctions'

const TestPages = async () => {
  const user = await getCurrentUser()
  isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
  const data = await ac_retrieveAllLists()
  const filteredList = data.lists.map((list) => {
    return { name: list?.id, id: list?.name }
  })
  return (
    <div>
      <pre>{JSON.stringify(filteredList, null, 2)}</pre>
    </div>
  )
}

export default TestPages
