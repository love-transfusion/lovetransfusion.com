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
          return (
            <div
              key={item.id}
              className={'flex gap-2 items-center text-primary px-6'}
            >
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
