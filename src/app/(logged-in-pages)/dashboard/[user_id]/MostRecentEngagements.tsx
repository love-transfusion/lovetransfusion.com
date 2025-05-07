import React from 'react'
import anonymous from './images/user.webp'
import Image from 'next/image'
import ltWebsiteIcon from './images/world-w.svg'
interface I_MostRecentEngagements {
  clRecipientOBj: I_supaorg_recipient_hugs_counters_comments
}

const MostRecentEngagements = ({ clRecipientOBj }: I_MostRecentEngagements) => {
  const comments = clRecipientOBj.comments.map(
    (recipient: I_supaorg_comments) => {
      const { location, id, public_profiles, created_at, name } = recipient
      // const profilePicture = recipient.public_profiles.profile_picture
      return {
        location,
        id,
        public_profiles,
        created_at,
        name,
      }
    }
  )
  const hugs = clRecipientOBj.hugs.map((recipient) => {
    // const public_profiles = recipient.public_profiles
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
    <div
      className={
        'pl-4 md:pl-[39px] xl:pl-[10px] pr-4 md:pr-[39px] xl:pr-[18px] pt-[3px] -mt-[6px] max-h-[586px] md:min-w-[337px] lg:min-w-[640px] xl:min-w-[337px] overflow-hidden relative mx-auto'
      }
    >
      <div
        className={
          'h-32 w-full bg-gradient-to-t from-[#FFFFFF] to-[#FFFFFF00] absolute -bottom-4'
        }
      />
      <p
        className={
          'mx-5 bg-gradient-to-b from-[#2F8FDD] to-[#2EB4DB] pt-2 pb-[3px] text-[17.69px] text-center text-white uppercase rounded-t-lg mt-[46px] xl:mt-0 2xl:mt-[unset]'
        }
      >
        Most Recent
      </p>
      <div
        className={
          'bg-[#EEF6FC] rounded-lg text-sm shadow-[0px_0px_12px_0px_#288CCC45]'
        }
      >
        <div
          className={
            'flex justify-between text-[12px] text-primary pl-16 px-6 leading-tight py-[7px]'
          }
        >
          <p className={'text-[10.11px] tracking-[1px]'}>NAME</p>
          <p className={'text-[10.11px] tracking-[1px]'}>SOURCE</p>
        </div>
        <div className={'divide-y divide-primary-200'}>
          {combinedEngagements.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  'flex gap-2 justify-between px-4 py-[7px] min-w-[9px] min-h-[9px] first:bg-white first:scale-105 first:px-[23] first:text-base first:shadow-[0px_0px_15px_0px_#2FABDD40] first:border-t first:border-primary first:rounded-[4px] first:font-semibold text-base'
                }
              >
                <div className={'flex items-center gap-3'}>
                  <Image
                    src={
                      item.public_profiles?.profile_picture?.fullPath
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_ORG_STORAGE_URL}/${item.public_profiles?.profile_picture?.fullPath}`
                        : anonymous
                    }
                    alt="Profile picture of engager"
                    quality={100}
                    width={37.8}
                    height={37.8}
                    className="border-[3px] border-[#288CCC] rounded-full min-w-[37.7px] min-h-[37.7px]"
                  />
                  <p className={'text-[#009933]'}>
                    {item.public_profiles
                      ? item.public_profiles?.full_name ||
                        `${item.public_profiles?.first_name} ${item.public_profiles?.last_name}`
                      : 'Someone Who Cares'}
                  </p>
                </div>
                <Image
                  src={ltWebsiteIcon}
                  alt="LT Website Icon"
                  quality={100}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MostRecentEngagements
