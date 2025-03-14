import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import Input from '@/app/components/inputs/basic-input/Input'
import TextArea from '@/app/components/inputs/textarea/TextArea'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface I_ContactMessageForm {
  clContainerClassName?: string
}

const ContactMessageForm = ({ clContainerClassName }: I_ContactMessageForm) => {
  return (
    <div
      className={twMerge(
        'flex flex-col gap-4 shadow-custom2 lg:min-w-[420px] xl:min-w-[500px] p-[28px] rounded-lg bg-white h-fit',
        clContainerClassName
      )}
    >
      <div className={'flex flex-col md:flex-row gap-4'}>
        <div className={'flex flex-col gap-1 w-full'}>
          <p className={'text-[#999]'}>Your Name *</p>
          <Input clPlaceholder="Name" />
        </div>
        <div className={'flex flex-col gap-1 w-full'}>
          <p className={'text-[#999]'}>Email *</p>
          <Input clPlaceholder="Email address" />
        </div>
      </div>
      <div className={'flex flex-col gap-1 w-full'}>
        <p className={'text-[#999]'}>Message *</p>
        <TextArea clPlaceholder="What can we do for you?" clRows={5} />
      </div>
      <Button
        clVariant="outlined"
        className="border-none rounded-[4px] flex py-1 shadow-[0_0_12px_0_#288ccc45] w-full md:w-[216px] h-[40px] items-center pr-5 mx-auto mt-[6px]"
      >
        <div
          className={
            'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
          }
        >
          <p className={'mx-auto text-[17px] text-center font-acuminProLight'}>
            Submit
          </p>
          <div className={'pl-[19px]'}>
            <Icon_right5 className="size-[19px]" />
          </div>
        </div>
      </Button>
    </div>
  )
}

export default ContactMessageForm
