'use client'
import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import React, { useState } from 'react'
import { supa_admin_create_account } from '../actions'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'
import { supa_admin_update_recipient_website } from './actions'

const CreateAccountButton = ({
  uuid,
  foundRecipient,
  orgRecipient,
}: {
  uuid: UUID
  orgRecipient: I_supaorg_recipient_hugs_counters_comments
  foundRecipient: I_supa_users_data_website_row | null
}) => {
  const [isLoading, setisLoading] = useState<boolean>(false)
  const { settoast } = useStore(utilityStore)
  const handleClick = async () => {
    setisLoading(true)
    const { data, error } = await supa_admin_create_account({
      email: orgRecipient.email,
      parent_name: orgRecipient.parent_name!,
    })
    if (!error && data) {
      // update users_data_website table
      await supa_admin_update_recipient_website({
        user_id: data.user?.id,
        id: uuid,
      })

      setisLoading(false)
      settoast({
        clDescription: 'Account successfully created.',
        clStatus: 'success',
      })
    } else if (error) {
      settoast({ clDescription: error, clStatus: 'error' })
    }
  }
  return (
    <Button
      clDisabled={isLoading}
      onClick={handleClick}
      clVariant="outlined"
      className={`flex py-1 shadow-custom1 w-[259px] h-[46px] items-center pr-5 rounded-[4px] max-sm:w-full ml-auto mb-[18px] ${
        isLoading && 'bg-neutral-300 hover:bg-neutral-300'
      }`}
    >
      <div
        className={
          'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
        }
      >
        <p className={'text-lg mx-auto text-center font-acuminProLight'}>
          {foundRecipient?.user_id
            ? 'Update Account'
            : `${isLoading ? 'Creating Account...' : 'Create Account'}`}
        </p>
        <div className={'pl-[19px]'}>
          <Icon_right5 className="size-[19px]" />
        </div>
      </div>
    </Button>
  )
}

export default CreateAccountButton
