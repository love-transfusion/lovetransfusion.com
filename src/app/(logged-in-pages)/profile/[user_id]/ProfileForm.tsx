'use client'
import React from 'react'
import Input from '@/app/components/inputs/basic-input/Input'
import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import { useForm } from 'react-hook-form'
import { util_capitalize } from '@/app/utilities/util_capitalize'
import { supa_update_users } from '@/app/_actions/users/actions'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'
import { util_formatDateToUTCString } from '@/app/utilities/date-and-time/util_formatDateToUTCString'

export interface I_ProfileForm {
  recipientName: string
  fullName: string
  email: string
  birthday?: string
}

const ProfileForm = ({ user }: { user: I_supa_users_row }) => {
  const { settoast } = useStore(utilityStore)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<I_ProfileForm>({
    defaultValues: async () => {
      return {
        recipientName: util_capitalize(user.recipient_name ?? ''),
        fullName: util_capitalize(user.parent_name ?? ''),
        email: user.email ?? '',
        birthday: user.birthday ? user.birthday.slice(0, 10) : '',
      }
    },
  })

  const onSubmit = async (rawData: I_ProfileForm) => {
    if (!user.id) return
    const { error } = await supa_update_users({
      id: user.id,
      email: user.email,
      recipient_name: rawData.recipientName,
      parent_name: rawData.fullName,
      birthday: rawData.birthday
        ? util_formatDateToUTCString(new Date(rawData.birthday))
        : null,
    })
    if (error) {
      settoast({ clDescription: error, clStatus: 'error' })
    } else {
      settoast({
        clDescription: 'Profile successfully updated.',
        clStatus: 'success',
      })
    }
  }

  return (
    <form className={'flex flex-col gap-6'} onSubmit={handleSubmit(onSubmit)}>
      <div className={'flex flex-col gap-1'}>
        <label className="text-[#999]" htmlFor="email">
          {`Recipient's name *`}
        </label>
        <Input
          clPlaceholder="Enter the recipient's name *"
          id="recipientName"
          {...register('recipientName', {
            required: "Recipient's name is required",
          })}
          clErrorMessage={errors.recipientName?.message}
        />
      </div>
      <div className={'flex flex-col gap-1'}>
        <label className="text-[#999]" htmlFor="Password">
          Full Name *
        </label>
        <Input
          clPlaceholder="Enter your name *"
          id="fullName"
          {...register('fullName', {
            required: 'Full name is required',
          })}
          clErrorMessage={errors.fullName?.message}
        />
      </div>
      <div className={'flex flex-col gap-1'}>
        <label className="text-[#999]" htmlFor="Password">
          Email address *
        </label>
        <Input
          clDisabled={true}
          clPlaceholder="Enter your email *"
          id="email"
          {...register('email', {
            required: 'Enter your email address',
            pattern: {
              value: /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/i,
              message: 'Please enter a valid email',
            },
          })}
          className="text-neutral-400 pointer-events-none"
          clErrorMessage={errors.fullName?.message}
        />
      </div>
      <div className={'flex flex-col gap-1'}>
        <label className="text-[#999]" htmlFor="Password">
          Birthday *
        </label>
        <Input {...register('birthday')} clPlaceholder="" type="date" />
      </div>

      <Button
        clDisabled={isSubmitting}
        clType="submit"
        clVariant="outlined"
        className={`border-none rounded-[4px] flex py-1 shadow-[0_0_15px_0_rgba(40,140,204,0.30)] h-[46px] items-center pr-5 ${
          isSubmitting && 'bg-neutral-300 hover:bg-neutral-300'
        }`}
      >
        <div
          className={
            'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
          }
        >
          <p className={'mx-auto text-center font-acumin-semi-condensed'}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </p>
          <div className={'pl-[19px]'}>
            <Icon_right5 className="size-[19px]" />
          </div>
        </div>
      </Button>
    </form>
  )
}

export default ProfileForm
