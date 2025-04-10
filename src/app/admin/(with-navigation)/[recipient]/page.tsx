import Icon_left from '@/app/components/icons/Icon_left'
import React from 'react'
import facebookAdId from './images/facebook-ad.webp'
import facebook from './images/facebook.webp'
import insta from './images/insta.webp'
import lovetransfusion from './images/lovetransfusion.webp'
import pinterest from './images/pinterest.webp'
import twitter from './images/twitter.webp'
import Image from 'next/image'
import Input from '@/app/components/inputs/basic-input/Input'
import Link from 'next/link'
import CreateAccountButton from './CreateAccountButton'
import { fetchDataFromLTOrg } from '@/app/_actions/orgRecipients/actions'
import { supa_select_user } from '@/app/_actions/users/actions'
import { supa_admin_select_recipient_data } from '@/app/_actions/admin/actions'

type Params = Promise<{ recipient: UUID }>

const RecipientPage = async (props: { params: Params }) => {
  const { recipient } = await props.params
  const { data: foundRecipient } = await supa_admin_select_recipient_data(
    recipient
  )

  let user
  if (foundRecipient?.user_id) {
    const { data } = await supa_select_user(foundRecipient?.user_id)
    user = data
  }

  const recipientData: {
    recipients: I_supaorg_recipient_hugs_counters_comments[]
  } = await fetchDataFromLTOrg(recipient)
  const recipientObject = recipientData.recipients[0]
  return (
    <div className="py-10 md:py-[64px] px-4 md:px-8 flex flex-col gap-5 bg-[#F3F4F6] h-full 2xl:h-[calc(100vh-85px)]">
      <div className={'w-fit'}>
        <Link href={'/admin'} className="flex gap-[5px] items-center ">
          <Icon_left className="size-7" />
          <p className={'text-[26px] font-bold'}>Back</p>
        </Link>
      </div>
      <div
        className={
          'flex px-4 md:px-8 py-[30px] rounded-lg lg:rounded-bl-[100px] lg:rounded-tl-[100px] bg-gradient-to-r from-[#2F93DD] to-[#2FBADD] mt-20 mb-5 md:mt-11 md:mb-11 max-sm:pt-[120px] md:pl-[195px] lg:pl-[191px] text-white relative animate-slide-up'
        }
      >
        <div
          className={
            'h-[176px] w-[176px] z-50 absolute -top-[88px] left-0 right-0 max-sm:mx-auto md:top-0 md:bottom-0 md:my-auto md:left-2 lg:-left-[2px] md:right-[unset]'
          }
        >
          <div
            className={
              'overflow-hidden relative w-full h-full rounded-full border-4 border-white bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-center'
            }
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_ORG_STORAGE_URL}/${recipientObject.profile_picture.fullPath}`}
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
                ? new Date(user?.birthday).toLocaleDateString()
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
              'text-lg max-sm:max-w-[200px] md:text-xl font-bold bg-white px-2 absolute -top-7 md:-top-4 left-5'
            }
          >{`Description of the Recipient's situation:`}</p>
          <p className={'text-[#4b5563]'}>
            Claire was diagnosed with Neuroblastoma (a type of pediatric cancer)
            on June 11th, 2020 when she was only 2 years old.
          </p>
        </div>
        <div
          className={'grid grid-cols-1 md:grid-cols-2 w-full gap-4 mt-[15px]'}
        >
          <div className={'flex gap-4 w-full'}>
            <Image
              src={facebook}
              quality={100}
              alt="facebook"
              className="max-h-[42px]"
            />
            <Input
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-black py-2"
              clVariant="input2"
              clContainerClassName="w-full"
            />
          </div>
          <div className={'flex gap-4 w-full'}>
            <Image
              src={twitter}
              quality={100}
              alt="twitterX"
              className="max-h-[42px]"
            />
            <Input
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-black py-2"
              clVariant="input2"
              clContainerClassName="w-full"
            />
          </div>
          <div className={'flex gap-4 w-full'}>
            <Image
              src={insta}
              quality={100}
              alt="Instagram"
              className="max-h-[42px]"
            />
            <Input
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-black py-2"
              clVariant="input2"
              clContainerClassName="w-full"
            />
          </div>
          <div className={'flex gap-4 w-full'}>
            <Image
              src={pinterest}
              quality={100}
              alt="Pinterest"
              className="max-h-[42px]"
            />
            <Input
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-black py-2"
              clVariant="input2"
              clContainerClassName="w-full"
            />
          </div>
          <div className={'flex gap-4 w-full'}>
            <Image
              src={lovetransfusion}
              quality={100}
              alt="Love Transfusion Logo"
              className="max-h-[42px] min-w-[42px]"
            />
            <Input
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-black py-2"
              clVariant="input2"
              defaultValue={
                recipientObject.path_url
                  ? `https://www.lovetransfusion.org/${recipientObject.path_url}`
                  : ''
              }
              clDisabled={true}
              clContainerClassName="w-full text-neutral-400"
            />
          </div>
          <div className={'flex gap-4 w-full'}>
            <Image
              src={facebookAdId}
              quality={100}
              alt="Facebook ad logo"
              className="max-h-[42px] min-w-[42px]"
            />
            <Input
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-black py-2"
              clVariant="input2"
              clContainerClassName="w-full"
            />
          </div>
        </div>
        <CreateAccountButton
          orgRecipient={recipientObject}
          foundRecipient={foundRecipient}
          uuid={recipient}
        />
      </div>
    </div>
  )
}

export default RecipientPage
