'use client'
import Button from '@/app/components/Button/Button'
import React from 'react'
import { supa_admin_upsert_list_of_recipients } from './actions'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'

const UpdateButton = ({
  formattedRecipients,
}: {
  formattedRecipients: {
    recipient: I_supa_users_data_website_insert['recipient']
    id: I_supa_users_data_website_insert['id']
  }[]
}) => {
  const { settoast } = useStore(utilityStore)
  const handleClick = async () => {
    const error = await supa_admin_upsert_list_of_recipients(
      formattedRecipients
    )
    if (error) {
      settoast({ clStatus: 'error', clDescription: error })
    }
  }
  return (
    <Button className="mt-10" onClick={handleClick}>
      Update Database
    </Button>
  )
}

export default UpdateButton
