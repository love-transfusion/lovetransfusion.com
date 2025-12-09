/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Icon_heart from '@/app/components/icons/Icon_heart'
import { I_Comments } from '@/types/Comments.types'
import React from 'react'
import Marquee from 'react-fast-marquee'
import anonymous from '@/app/(logged-in-pages)/dashboard/[user_id]/images/user.webp'
import Image from 'next/image'
import heart from './images/scroll-heart.svg'

interface I_SlidingSupportersName {
  allEngagements: I_Comments[]
}

const SlidingSupportersName = ({ allEngagements }: I_SlidingSupportersName) => {
  const combinedEngagements = allEngagements.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA
  })
  return (
    <div className={'flex items-center min-h-8 bg-[#E5F4FA]'}>
      <Marquee speed={50} autoFill={true}>
        {combinedEngagements.map((item) => {
          let profilePicture: string | undefined

          switch (item.type) {
            case 'website':
              profilePicture =
                item.type === 'website' &&
                item.profile_picture_website?.users_profile_pictures
                  ? (item.profile_picture_website
                      .users_profile_pictures as unknown as {
                      blurDataURL: string
                      fullPath: string
                      id: string
                      path: string
                    }) &&
                    `${process.env.NEXT_PUBLIC_SUPABASE_ORG_STORAGE_URL}/${item.profile_picture_website.users_profile_pictures.bucket_name}/${item.profile_picture_website.users_profile_pictures.storage_path}`
                  : undefined
              break
            case 'facebook':
              profilePicture = item.profile_picture
                ? item.profile_picture
                : undefined
              break
          }

          return (
            <div
              key={item.id}
              className={'flex gap-2 items-center text-primary px-6'}
            >
              {/* {profilePicture ? (
                <Image
                  src={profilePicture ?? anonymous}
                  quality={100}
                  width={25}
                  height={25}
                  alt="Profile picture"
                  className="rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/images/user.webp`
                  }}
                  unoptimized
                />
              ) : (
                <div className="bg-primary-200 w-[25px] h-[25px] rounded-full flex items-center justify-center">
                  <Icon_heart className="size-[14px] mt-[2px]" />
                </div>
              )} */}
              {/* <Icon_heart /> */}
              <Image
                src={heart}
                alt="Heart"
                quality={100}
                width={24}
                height={24}
              />
              <p className="w-fit text-nowrap text-sm">{item.name}</p>
            </div>
          )
        })}
      </Marquee>
    </div>
  )
}

export default SlidingSupportersName
