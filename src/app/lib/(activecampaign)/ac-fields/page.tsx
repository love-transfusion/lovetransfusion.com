import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import React from 'react'
import { isAdmin } from '../../adminCheck'
import { ac_retrieveAllFields } from '@/app/utilities/activeCampaignFunctions'

const FieldsPage = async () => {
  const user = await getCurrentUser()
  isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
  const { data } = await ac_retrieveAllFields()
  const filteredList = data?.fields.map((list) => {
    return { name: list.title, id: list.id }
  })
  return (
    <div>
      <pre>{JSON.stringify(filteredList, null, 2)}</pre>
    </div>
  )
}

export default FieldsPage
