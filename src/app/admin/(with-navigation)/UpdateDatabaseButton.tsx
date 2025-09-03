'use client'
import Button from '@/app/components/Button/Button'
import React, { useState } from 'react'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'
import { supa_select_org_recipients } from '@/app/_actions/orgRecipients/actions'
import { supa_admin_upsert_list_of_recipients } from '@/app/_actions/admin/actions'

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
    const data: I_data = await supa_select_org_recipients({ fetch_all: true })

    if (!data?.recipients) return
    const formattedRecipients = data.recipients.map((recipient) => {
      return { recipient, id: recipient.id, created_at: recipient.created_at }
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
      className={`-mb-[6px] md:min-w-[154px] ${
        isLoading && 'bg-neutral-300 hover:bg-neutral-300 border-neutral-400'
      }`}
      onClick={handleClick}
    >
      {isLoading ? 'Syncing' : 'Sync'}
    </Button>
  )
}

export default UpdateButton
