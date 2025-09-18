import Icon_heart from '@/app/components/icons/Icon_heart'
import React from 'react'
import Marquee from 'react-fast-marquee'

interface I_SlidingSupportersName {
  clRecipient: I_supaorg_recipient_hugs_counters_comments
}

const SlidingSupportersName = ({ clRecipient }: I_SlidingSupportersName) => {
  const comments = clRecipient.comments.map((recipient: I_supaorg_comments) => {
    const { location, id, public_profiles, created_at, name } = recipient
    // const profilePicture = recipient.public_profiles.profile_picture
    return {
      location,
      id,
      public_profiles,
      created_at,
      name,
    }
  })
  const hugs = clRecipient.hugs.map((recipient) => {
    const { location, id, created_at, public_profiles } = recipient
    const name = recipient.public_profiles?.full_name
    return {
      location,
      id,
      public_profiles,
      created_at,
      name,
    }
  })
  const combinedEngagements = [...comments, ...hugs].sort((a, b) => {
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
              <Icon_heart className="size-[14px]" />
              <p className="w-fit text-nowrap text-sm">
                {item.name ?? 'Someone Who Cares'}
              </p>
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
