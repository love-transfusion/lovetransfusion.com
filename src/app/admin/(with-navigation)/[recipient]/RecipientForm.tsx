'use client'
import Image from 'next/image'
import React from 'react'
import facebookAdId from './images/facebook-ad.webp'
import facebook from './images/facebook.webp'
import insta from './images/insta.webp'
import lovetransfusion from './images/lovetransfusion.webp'
import pinterest from './images/pinterest.webp'
import twitter from './images/twitter.webp'
import Input from '@/app/components/inputs/basic-input/Input'
import Button from '@/app/components/Button/Button'
import { useStore } from 'zustand'
import { supa_admin_create_account } from '@/app/_actions/admin/actions'
import utilityStore from '@/app/utilities/store/utilityStore'
import { supa_admin_update_recipient_website } from './actions'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import { useForm } from 'react-hook-form'
import { supa_update_users } from '@/app/_actions/users/actions'

interface recipientFormTypes {
  facebookURL: string | null | undefined
  twitterURL: string | null | undefined
  instagramURL: string | null | undefined
  pinteresetURL: string | null | undefined
  // websiteURL: string | null | undefined
  fbAdID: string | null | undefined
}

interface RecipientForm {
  recipientObject: I_supaorg_recipient_hugs_counters_comments
  recipient: UUID
  user: I_supa_users_with_profpic_dataweb | null
}

const RecipientForm = ({ user, recipientObject, recipient }: RecipientForm) => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting: isLoading, isSubmitSuccessful },
  } = useForm<recipientFormTypes>({
    defaultValues: async () => {
      return {
        facebookURL: '',
        twitterURL: '',
        instagramURL: '',
        pinteresetURL: '',
        // websiteURL: '',
        fbAdID: user?.fb_ad_id,
      }
    },
  })
  const { settoast } = useStore(utilityStore)

  const updateUser = async (data: recipientFormTypes, recipient_id: string) => {
    await supa_update_users({ id: recipient_id, fb_ad_id: data.fbAdID || null })
  }

  const onSubmit = async (rawData: recipientFormTypes) => {
    if (!user) {
      // Create an account for the recipient
      const { data, error } = await supa_admin_create_account({
        email: recipientObject.email,
        parent_name: recipientObject.parent_name!,
        recipient_name: recipientObject.first_name!,
        recipient_id: recipientObject.id,
      })

      if (!error && data && data.user?.id) {
        // Update user's website data
        await supa_admin_update_recipient_website({
          user_id: data.user.id,
          id: recipient,
        })
        await updateUser(rawData, data.user.id)

        settoast({
          clDescription: 'Account successfully created.',
          clStatus: 'success',
        })
      }
    } else {
      // If recipient has an existing account perform update
      await updateUser(rawData, user.id)
      settoast({
        clDescription: 'Successfully updated recipient',
        clStatus: 'success',
      })
    }
  }
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
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
              disabled
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-neutral-400 py-2"
              clVariant="input2"
              clContainerClassName="w-full"
              {...register('facebookURL')}
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
              disabled
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-neutral-400 py-2"
              clVariant="input2"
              clContainerClassName="w-full"
              {...register('twitterURL')}
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
              disabled
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-neutral-400 py-2"
              clVariant="input2"
              clContainerClassName="w-full"
              {...register('instagramURL')}
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
              disabled
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-neutral-400 py-2"
              clVariant="input2"
              clContainerClassName="w-full"
              {...register('pinteresetURL')}
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
              disabled
              clPlaceholder="Type URL"
              className="placeholder:text-neutral-400 border-neutral-400 py-2"
              clVariant="input2"
              defaultValue={
                recipientObject.path_url
                  ? `https://www.lovetransfusion.org/${recipientObject.path_url}`
                  : ''
              }
              clContainerClassName="w-full text-neutral-400"
              // {...register('websiteURL')}
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
              clPlaceholder="Type facebook Ad ID"
              className="placeholder:text-neutral-400 border-black py-2"
              clVariant="input2"
              clContainerClassName="w-full"
              {...register('fbAdID')}
            />
          </div>
        </div>
        <Button
          clType="submit"
          clDisabled={isLoading}
          clVariant="outlined"
          className={`flex py-1 shadow-custom1 w-[259px] h-[46px] items-center pr-5 rounded-[4px] max-sm:w-full mt-[26px] ml-auto mb-[18px] ${
            isLoading && 'bg-neutral-300 hover:bg-neutral-300'
          }`}
        >
          <div
            className={
              'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
            }
          >
            <p
              className={'text-lg mx-auto text-center font-acumin-variable-90'}
            >
              {isSubmitSuccessful || user?.id
                ? 'Update Account'
                : `${isLoading ? 'Creating Account...' : 'Create Account'}`}
            </p>
            <div className={'pl-[19px]'}>
              <Icon_right5 className="size-[19px]" />
            </div>
          </div>
        </Button>
      </form>
    </div>
  )
}

export default RecipientForm
