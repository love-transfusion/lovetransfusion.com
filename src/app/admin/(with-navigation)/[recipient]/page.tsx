import Icon_left from '@/app/components/icons/Icon_left'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supa_select_user } from '@/app/_actions/users/actions'
import RecipientForm from './RecipientForm'
import { supa_select_recipients } from '@/app/_actions/recipients/actions'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'

type Params = Promise<{ recipient: UUID }>

export interface OpenGraph_Types {
  description?: string
  title?: string
}

export interface Editor_Type {
  HtmlContent: string
  plainText: string
  charactersLength: number
}

const RecipientPage = async (props: { params: Params }) => {
  const { recipient } = await props.params

  const { data: user } = await supa_select_user(recipient)

  const { data: recipientData } = await supa_select_recipients(recipient)

  if (!recipientData || Array.isArray(recipientData)) return

  const unknown_recipientObject = recipientData.recipient as unknown
  const recipientObject = unknown_recipientObject as I_supaorg_recipient

  const sec_one_paragraph =
    recipientObject.sec_one_paragraph as unknown as Editor_Type

  return (
    <div className="py-10 md:py-[64px] px-4 md:px-8 flex flex-col gap-5 bg-[#F3F4F6] min-h-full 2xl:min-h-[calc(100vh-85px)]">
      <div className={'w-fit'}>
        <Link href={'/admin'} className="flex gap-[5px] items-center ">
          <Icon_left className="size-7" />
          <p className={'text-[26px] font-bold'}>Back</p>
        </Link>
      </div>
      <div
        className={
          'flex px-4 md:px-8 py-[30px] rounded-lg lg:rounded-bl-[100px] lg:rounded-tl-[100px] bg-gradient-to-r from-[#2F93DD] to-[#2FBADD] mt-20 mb-5 md:mt-11 md:mb-11 pt-[120px] md:pt-[unset] md:pl-[195px] lg:pl-[191px] text-white relative animate-slide-up'
        }
      >
        <div
          className={
            'h-[176px] w-[176px] z-50 absolute -top-[88px] left-0 right-0 mx-auto md:mx-[unset] md:top-0 md:bottom-0 md:my-auto md:left-2 lg:-left-[2px] md:right-[unset]'
          }
        >
          <div
            className={
              'overflow-hidden relative w-full h-full rounded-full border-4 border-white bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-center'
            }
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_ORG_STORAGE_URL}/${recipientObject.recipients_profile_pictures.bucket_name}/${recipientObject.recipients_profile_pictures.storage_path}`}
              alt={`Benny's Profile Picture`}
              fill
              quality={100}
              className="object-cover"
            />
          </div>
        </div>

        <div
          className={
            'flex flex-row flex-wrap items-center justify-start xl:min-w-[935px] gap-y-5 gap-x-10 md:gap-x-14'
          }
        >
          <div className={'flex-col w-fit'}>
            <p className={''}>Recipient</p>
            <p className={'md:text-xl font-bold capitalize'}>
              {recipientObject.first_name}
            </p>
          </div>
          <div className={'flex-col w-fit'}>
            <p className={''}>Applied By</p>
            <p className={'md:text-xl font-bold capitalize'}>
              {recipientObject.parent_name}
            </p>
          </div>
          <div className={'flex-col w-fit'}>
            <p className={''}>Date Of Birth</p>
            <p className={'md:text-xl font-bold'}>
              {user?.birthday
                ? new Date(user.birthday).toLocaleDateString()
                : '-'}
            </p>
          </div>
          <div className={'flex-col w-fit'}>
            <p className={''}>Relationship</p>
            <p className={'md:text-xl font-bold capitalize'}>
              {recipientObject.relationship}
            </p>
          </div>
          <div className={'flex-col w-fit'}>
            <p className={''}>Email</p>
            <p className={'md:text-xl font-bold'}>{recipientObject.email}</p>
          </div>
        </div>
      </div>
      <div
        className={
          'flex flex-col items-start shadow-[0px_0px_20px_0px_#0000004D] pt-10 p-6 rounded-lg gap-[26px] bg-white animate-slide-up'
        }
      >
        <div
          className={
            'border border-black rounded-lg px-[28px] pt-10 md:pt-5 pb-[17px] w-full relative'
          }
        >
          <p
            className={
              'text-lg w-[200px] md:w-[unset] md:text-xl font-bold bg-white px-2 absolute -top-7 md:-top-4 left-5'
            }
          >{`Description of the Recipient's situation:`}</p>
          <div
            className={'recipient-content pr-0 md:pr-[50px] text-lg'}
            dangerouslySetInnerHTML={{
              __html: sec_one_paragraph.HtmlContent,
            }}
          />
        </div>
        <RecipientForm recipientObject={recipientObject} user={user} />
      </div>
    </div>
  )
}

export default RecipientPage
