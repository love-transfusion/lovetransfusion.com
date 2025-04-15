'use client'
import React, { useEffect, useState } from 'react'
import Input from '@/app/components/inputs/basic-input/Input'
import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import { useForm } from 'react-hook-form'
import { util_capitalize } from '@/app/utilities/util_capitalize'
import { supa_update_users } from '@/app/_actions/users/actions'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'
import { util_formatDateToUTCString } from '@/app/utilities/date-and-time/util_formatDateToUTCString'
import { I_LocalImage, useUploadImage } from '@/app/hooks/useUploadImage'
import Image from 'next/image'
import Icon_upload from '@/app/components/icons/Icon_upload'
import { I_ProfileForm, I_UserWithProfilePicture } from './ProfileForm'

const BasicInformation = ({
  user,
  users_data_website,
}: {
  user: I_UserWithProfilePicture
  users_data_website: I_supa_users_data_website_row[]
}) => {
  const [localImage, setlocalImage] = useState<I_LocalImage[]>([])
  const { getRootProps, getInputProps, images, error, uploadAllToSupabase } =
    useUploadImage({
      clUser_id: user.id,
      clStorageName: 'user-uploads',
      clSingleImageOnly: true,
      clTableName: 'profile_pictures',
    })
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
    uploadAllToSupabase()
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
  useEffect(() => {
    if (images.length > 0) {
      setlocalImage([images[0]])
    }
  }, [images])

  return (
    <div className="animate-slide-in-right">
      <div className={'flex flex-col gap-1'}>
        <div className="group/profilepic rounded-full mb-5 mx-auto">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-full text-center cursor-pointer w-[120px] h-[120px] relative ${
              localImage.length > 0 ||
              user.profile_pictures?.storage_path ||
              users_data_website[0].recipient?.profile_picture?.fullPath
                ? 'border-white'
                : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <Image
              src={
                localImage.length > 0
                  ? localImage[localImage.length - 1].previewUrl
                  : `${
                      user.profile_pictures?.storage_path
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${user.profile_pictures?.bucket_name}/${user.profile_pictures?.storage_path}`
                        : `${process.env.NEXT_PUBLIC_SUPABASE_ORG_STORAGE_URL}${users_data_website[0].recipient?.profile_picture?.fullPath}`
                    }`
              }
              alt="profile placeholder"
              blurDataURL={
                localImage.length > 0
                  ? localImage[localImage.length - 1].blurDataURL
                  : `${
                      user.profile_pictures?.blur_data_url ??
                      users_data_website[0].recipient?.profile_picture
                        ?.blurDataURL
                    }`
              }
              placeholder={'blur'}
              fill
              quality={100}
              className="bg-neutral-100 rounded-full object-cover"
            />
            <div
              className={
                'w-full h-full backdrop-blur-[2px] rounded-full overflow-hidden hidden group-hover/profilepic:block'
              }
            >
              <Icon_upload className="absolute inset-0 w-full my-auto text-white min-w-8 min-h-8" />
            </div>
          </div>
          {error && <p className="mt-2 text-red-500">Error: {error}</p>}
        </div>
      </div>
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
    </div>
  )
}

export default BasicInformation
