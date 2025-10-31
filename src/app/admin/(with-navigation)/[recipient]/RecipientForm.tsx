'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
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
import Icon_right5 from '@/app/components/icons/Icon_right5'
import { useForm } from 'react-hook-form'
import { I_supa_select_user_Response_Types } from '@/app/_actions/users/actions'
import { supa_update_recipients } from '@/app/_actions/recipients/actions'
import {
  supa_delete_facebook_posts,
  supa_select_facebook_posts,
  supa_upsert_facebook_posts,
} from '@/app/_actions/facebook_posts/actions'
import Link from 'next/link'
import Icon_information from '@/app/components/icons/Icon_information'

interface recipientFormTypes {
  facebookPostID: string
  twitterURL: string | null | undefined
  instagramURL: string | null | undefined
  pinteresetURL: string | null | undefined
  // websiteURL: string | null | undefined
}

interface RecipientForm {
  recipientObject: I_supaorg_recipient_hugs_counters_comments
  user: I_supa_select_user_Response_Types | null
}

const getFacebookPostID = (postID: string) => {
  const arrPostID = postID.split('_')
  return arrPostID.length > 1 ? arrPostID[1] : postID
}

const RecipientForm = ({ user, recipientObject }: RecipientForm) => {
  const [isSubmitted, setisSubmitted] = useState(false)
  const {
    handleSubmit,
    register,
    reset,
    setError,
    setFocus,
    formState: {
      isSubmitting: isLoading,
      isSubmitSuccessful,
      errors,
      dirtyFields,
    },
  } = useForm<recipientFormTypes>({
    defaultValues: async () => {
      return {
        facebookPostID: getFacebookPostID(user?.facebook_posts?.post_id || ''),
        twitterURL: '',
        instagramURL: '',
        pinteresetURL: '',
        // websiteURL: '',
      }
    },
  })
  const { settoast } = useStore(utilityStore)

  const isFacebookPostIdDirty = !!dirtyFields.facebookPostID

  const checkIfThereIsAnyThatExists = async (opt: {
    fb_post_id?: string
    recipient_id?: string
  }): Promise<boolean> => {
    const { fb_post_id, recipient_id } = opt

    if (!recipient_id) return false

    if (fb_post_id) {
      const { data: fbDataExists } = await supa_select_facebook_posts(
        fb_post_id,
        recipient_id
      )
      if (fbDataExists) {
        setError('facebookPostID', {
          type: 'validate',
          message: 'This Post ID is already in use.',
        })
        setFocus('facebookPostID')
        return !!fbDataExists
      }
    }
    return false
  }

  const updateUser = async (
    recipient_id: string,
    fb_post_id: string | null
  ): Promise<'ok' | 'duplicate' | 'error'> => {
    const tasks1 = []
    const tasks2 = []

    if (isFacebookPostIdDirty && fb_post_id) {
      tasks1.push(supa_delete_facebook_posts(recipient_id))
      tasks2.push(
        supa_upsert_facebook_posts({
          post_id: fb_post_id,
          page_id: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
          user_id: recipient_id,
          last_synced_at: null,
        })
      )
    } else if (!fb_post_id) {
      tasks1.push(supa_delete_facebook_posts(recipient_id))
    }

    await Promise.all(tasks1)
    await Promise.all(tasks2)
    settoast({
      clDescription: 'Account successfully updated.',
      clStatus: 'success',
    })
    return 'ok'
  }

  const insertOrUpdate = async (
    recipient_id: string,
    fb_post_id: string | null
  ): Promise<'ok' | 'duplicate' | 'error'> => {
    if (fb_post_id) {
      const { error } = await supa_upsert_facebook_posts({
        post_id: fb_post_id,
        page_id: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!,
        user_id: recipient_id,
        last_synced_at: null,
      })
      if (error) {
        settoast({ clDescription: error, clStatus: 'error' })
        return 'error'
      }
    }

    await Promise.all([
      supa_update_recipients({
        id: recipientObject.id,
        user_id: recipient_id,
      }),
    ])
    reset()
    return 'ok'
  }

  const onSubmit = async (rawData: recipientFormTypes) => {
    const post_id = rawData.facebookPostID
      ? `${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID!}_${rawData.facebookPostID}`
      : null

    if (!isFacebookPostIdDirty && user) return

    if (post_id) {
      const dataExists = await checkIfThereIsAnyThatExists({
        fb_post_id: post_id,
        recipient_id: user?.id,
      })
      if (dataExists) {
        return
      }
    }

    if (!user) {
      // Create an account for the recipient
      const { data, error } = await supa_admin_create_account({
        id: recipientObject.id,
        email: recipientObject.email,
        parent_name: (recipientObject.parent_name || '').split(' ')[0],
        recipient_name: recipientObject.first_name!,
        recipient_id: recipientObject.id,
      })

      if (error) {
        settoast({
          clDescription: error,
          clStatus: 'error',
        })
      }

      if (!error && data && data.user?.id) {
        await insertOrUpdate(data.user.id, post_id)
        settoast({
          clDescription: 'Account successfully created.',
          clStatus: 'success',
        })
        reset(rawData)
        setisSubmitted(true)
        return
      }
    } else {
      const status = await updateUser(user.id, post_id)

      if (status === 'duplicate') {
        // Nothing else; allow handleSubmit promise to resolve -> isLoading false
        return
      }
      if (status === 'ok') {
        reset(rawData) // ✅ now resets for existing users too
        setisSubmitted(true) // ✅ show "submitted" state
      }
    }
  }

  useEffect(() => {
    setisSubmitted(false)
  }, [isFacebookPostIdDirty])
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={'grid grid-cols-1 md:grid-cols-2 w-full gap-4 mt-[15px]'}
        >
          <div>
            <div className={'flex gap-4 w-full'}>
              <Image
                src={facebook}
                quality={100}
                alt="facebook"
                className="max-h-[42px]"
              />
              <Input
                clPlaceholder="Type Facebook post ID"
                className="placeholder:text-neutral-400 border-neutral-400 py-2"
                clVariant="input2"
                clContainerClassName="w-full"
                {...register('facebookPostID')}
                clErrorMessage={errors.facebookPostID?.message}
                clRightIcon={
                  <div title="How to get Post ID?">
                    <Link
                      href={'/images/how-to-get-postID.png'}
                      target="_blank"
                    >
                      <Icon_information />
                    </Link>
                  </div>
                }
              />
            </div>
            {isFacebookPostIdDirty &&
              user?.facebook_posts?.post_id &&
              !isSubmitted && (
                <div className="bg-primary-50 rounded-lg border border-primary-200 py-3 px-5 mt-2">
                  <p className={''}>
                    Changing this Facebook Post ID will permanently delete all
                    related data.
                  </p>
                </div>
              )}
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
          {!recipientObject.is_private && (
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
          )}
          {recipientObject.recipient_template === 'church' && (
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
                    ? `https://www.lovetransfusion.org/c/${recipientObject.path_url}`
                    : ''
                }
                clContainerClassName="w-full text-neutral-400"
                // {...register('websiteURL')}
              />
            </div>
          )}
        </div>

        {/* <FBAdIDs
          FBAdIDsArray={FBAdIDsArray}
          setFBAdIDs={setFBAdIDs}
          existingAdIDs={existingAdIDs}
          setisFBAdIDActive={setisFBAdIDActive}
        /> */}

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
                ? `${isLoading ? 'Updating Account...' : 'Update Account'}`
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
