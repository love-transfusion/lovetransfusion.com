import React from 'react'
import { ac_retrieveAllTags } from '@/app/utilities/activeCampaignFunctions'
import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { isAdmin } from '../../adminCheck'

const TestPages = async () => {
  const user = await getCurrentUser()
  isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })

  const { data } = await ac_retrieveAllTags()
  console.log({ data })
  const filteredTags = data?.tags.map((tag) => {
    return { name: tag.tag, id: tag.id }
  })
  return (
    <div>
      <pre>{JSON.stringify(filteredTags, null, 2)}</pre>
    </div>
  )
}

export default TestPages
