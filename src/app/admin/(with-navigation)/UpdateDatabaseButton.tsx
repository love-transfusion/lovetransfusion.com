'use client'
import Button from '@/app/components/Button/Button'
import React, { useState } from 'react'
import {
  fetchDataFromLTOrg,
  supa_admin_upsert_list_of_recipients,
} from './actions'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'

type I_data =
  | {
      recipients: I_supaorg_recipient_hugs_counters_comments[]
    }
  | undefined

const UpdateButton = () => {
  const { settoast } = useStore(utilityStore)
  const [isLoading, setisLoading] = useState<boolean>(false)

  const handleClick = async () => {
    setisLoading(true)
    const data: I_data = await fetchDataFromLTOrg({ fetch_all: true })

    if (!data?.recipients) return
    const formattedRecipients = data.recipients.map((recipient) => {
      return { recipient, id: recipient.id }
    })

    const error = await supa_admin_upsert_list_of_recipients(
      formattedRecipients
    )
    setisLoading(false)
    if (error) {
      settoast({ clStatus: 'error', clDescription: error })
    }
  }
  return (
    <Button
      clDisabled={isLoading}
      className={`-mb-[6px] min-w-[154px] ${
        isLoading &&
        'bg-neutral-300 hover:bg-neutral-300 border-neutral-400'
      }`}
      onClick={handleClick}
    >
      {isLoading ? 'Syncing' : 'Sync Database'}
    </Button>
  )
}

export default UpdateButton
