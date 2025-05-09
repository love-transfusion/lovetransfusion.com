'use client'
import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import Input from '@/app/components/inputs/basic-input/Input'
import TextArea from '@/app/components/inputs/textarea/TextArea'
import { ac_lists } from '@/app/lib/(activecampaign)/library/ac_lists'
import { resendEmail_MessageConfirmation } from '@/app/lib/resend_email_templates/resendEmail_MessageConfirmation'
import {
  ac_custom_create_contact,
} from '@/app/utilities/activeCampaignFunctions'
import utilityStore from '@/app/utilities/store/utilityStore'
import { util_getFirstAndLastName } from '@/app/utilities/util_getFirstNameAndLastName'
import React from 'react'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { useStore } from 'zustand'

interface I_ContactMessageForm {
  clContainerClassName?: string
}

interface I_contactForm {
  name: string
  email: string
  message: string
}

const ContactMessageForm = ({ clContainerClassName }: I_ContactMessageForm) => {
  const { settoast } = useStore(utilityStore)
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<I_contactForm>()

  const onSubmit = async (rawData: I_contactForm) => {
    const { firstName, lastName } = util_getFirstAndLastName(rawData.name)
    const { error } = await ac_custom_create_contact({
      clListName: ac_lists.getList('COM Website Contacts').name,
      data: {
        email: rawData.email,
        firstName: firstName,
        lastName: lastName,
        fieldValues: [{ field: '8', value: rawData.message }],
      },
    })
    reset()

    if (error) {
      settoast({
        clDescription: error,
        clStatus: 'error',
      })
    } else {
      resendEmail_MessageConfirmation({
        clEmail: rawData.email,
        clFirstName: firstName,
        clLastName: lastName,
        clMessage: rawData.message,
      })
      settoast({
        clDescription: 'Message successfully submitted',
        clStatus: 'success',
      })
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className={twMerge(
          'flex flex-col gap-4 shadow-custom2 lg:min-w-[420px] xl:min-w-[500px] p-[28px] rounded-lg bg-white h-fit',
          clContainerClassName
        )}
      >
        <div className={'flex flex-col md:flex-row gap-4'}>
          <div className={'flex flex-col gap-1 w-full'}>
            <p className={'text-[#999]'}>Your Name *</p>
            <Input {...register('name')} clPlaceholder="Name" />
          </div>
          <div className={'flex flex-col gap-1 w-full'}>
            <p className={'text-[#999]'}>Email *</p>
            <Input {...register('email')} clPlaceholder="Email address" />
          </div>
        </div>
        <div className={'flex flex-col gap-1 w-full'}>
          <p className={'text-[#999]'}>Message *</p>
          <TextArea
            {...register('message')}
            clPlaceholder="What can we do for you?"
            clRows={5}
          />
        </div>
        <Button
          clDisabled={isSubmitting}
          clVariant="outlined"
          className={`border-none rounded-[4px] flex py-1 shadow-[0_0_12px_0_#288ccc45] w-full md:w-[216px] h-[40px] items-center pr-5 mx-auto mt-[6px] ${
            isSubmitting && 'bg-neutral-300 hover:bg-neutral-300'
          }`}
        >
          <div
            className={
              'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
            }
          >
            <p
              className={
                'mx-auto text-[17px] text-center font-acumin-variable-90'
              }
            >
              Submit
            </p>
            <div className={'pl-[19px]'}>
              <Icon_right5 className="size-[19px]" />
            </div>
          </div>
        </Button>
      </div>
    </form>
  )
}

export default ContactMessageForm
