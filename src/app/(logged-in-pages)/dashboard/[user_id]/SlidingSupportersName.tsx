'use client'
import Icon_heart from '@/app/components/icons/Icon_heart'
import { util_getFirstNameAndLastNameFrom_publicProfiles } from '@/app/utilities/util_getFirstNameAndLastNameFrom_publicProfiles'
import { I_Comments } from '@/types/Comments.types'
import React from 'react'
import Marquee from 'react-fast-marquee'

interface I_SlidingSupportersName {
  clRecipient: I_supaorg_recipient_hugs_counters_comments
  formattedFBComments: I_Comments[]
}

const SlidingSupportersName = ({
  clRecipient,
  formattedFBComments,
}: I_SlidingSupportersName) => {
  const comments = clRecipient.comments.map((comment: I_supaorg_comments) => {
    const { location, id, public_profiles, created_at } = comment
    const { first_name, last_name } =
      util_getFirstNameAndLastNameFrom_publicProfiles({
        first_name: comment.public_profiles?.first_name,
        last_name: comment.public_profiles?.last_name,
        full_name: comment.public_profiles?.full_name,
      })
    return {
      location,
      id,
      public_profiles,
      created_at,
      name: `${first_name} ${last_name}`
        .toLowerCase()
        .split(' ')
        .includes('anonymous')
        ? 'Someone Who Cares'
        : `${first_name} ${last_name}`,
    }
  })
  const hugs = clRecipient.hugs.map((recipient) => {
    const { location, id, created_at, public_profiles } = recipient
    const { first_name, last_name } =
      util_getFirstNameAndLastNameFrom_publicProfiles({
        first_name: recipient.public_profiles?.first_name,
        last_name: recipient.public_profiles?.last_name,
        full_name: recipient.public_profiles?.full_name,
      })
    return {
      location,
      id,
      public_profiles,
      created_at,
      name: `${first_name} ${last_name}`
        .toLowerCase()
        .split(' ')
        .includes('anonymous')
        ? 'Someone Who Cares'
        : `${first_name} ${last_name}`,
    }
  })
  const fbComments = formattedFBComments.map((item) => {
    return {
      location: null,
      id: item.id,
      public_profile: null,
      created_at: item.created_at,
      name: item.name || 'Someone Who Cares',
    }
  })
  const combinedEngagements = [...comments, ...hugs, ...fbComments].sort(
    (a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    }
  )

  return (
    <div className={'flex items-center min-h-8 bg-[#E5F4FA]'}>
      <Marquee speed={50} autoFill={true}>
        {combinedEngagements.map((item) => {
          return (
            <div
              key={item.id}
              className={'flex gap-2 items-center text-primary px-6'}
            >
              <Icon_heart className="size-[14px]" />
              <p className="w-fit text-nowrap text-sm">{item.name}</p>
            </div>
          )
        })}
        {/* <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div>
        <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div>
        <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div>
        <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div> */}
      </Marquee>
    </div>
  )
}

export default SlidingSupportersName
