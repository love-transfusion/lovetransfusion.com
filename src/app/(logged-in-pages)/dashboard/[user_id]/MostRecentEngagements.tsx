import React from 'react'
import anonymous from './images/user.webp'
import Image from 'next/image'
import ltWebsiteIcon from './images/world-w.svg'
import { I_Comments } from '@/types/Comments.types'
import Icon_facebook2 from '@/app/components/icons/Icon_facebook2'
import FacebookProfilePic from './FacebookProfilePic'
interface I_MostRecentEngagements {
  allEngagements: I_Comments[]
}

const MostRecentEngagements = ({ allEngagements }: I_MostRecentEngagements) => {
  return (
    <div
      className={
        'pl-4 md:pl-[39px] xl:pl-[10px] pr-4 md:pr-[39px] xl:pr-6 2xl:pr-[18px] pt-[3px] -mt-[6px] max-h-[586px] md:min-w-[337px] lg:min-w-[640px] xl:min-w-[290px] 2xl:min-w-[337px] overflow-hidden relative mx-auto'
      }
    >
      <div
        className={
          'h-[150px] w-full  bg-gradient-to-b from-white/0 from-[0%] via-white/40 via-[70%] to-white/100 to-[90%] -left-2 absolute -bottom-4'
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
          {allEngagements
            .sort((a, b) => {
              const dateA = new Date(a.created_at).getTime()
              const dateB = new Date(b.created_at).getTime()
              return dateB - dateA
            })
            .map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    'flex gap-2 justify-between px-4 py-[7px] min-w-[9px] min-h-[9px] first:bg-white first:scale-105 first:px-[23] first:text-base first:shadow-[0px_0px_15px_0px_#2FABDD40] first:border-t first:border-primary first:rounded-[4px] first:font-semibold text-base'
                  }
                >
                  <div className={'flex items-center gap-3'}>
                    {item.type === 'website' && (
                      <Image
                        src={
                          item.profile_picture_website &&
                          item.profile_picture_website.profile_picture?.fullPath
                            ? `${process.env.NEXT_PUBLIC_SUPABASE_ORG_STORAGE_URL}/${item.profile_picture_website.profile_picture.fullPath}`
                            : anonymous
                        }
                        alt="Profile picture of engager"
                        quality={100}
                        width={37.8}
                        height={37.8}
                        className="border-[3px] border-[#288CCC] rounded-full min-w-[37.7px] min-h-[37.7px]"
                      />
                    )}
                    {item.type === 'facebook' && (
                      <FacebookProfilePic
                        fbProfilePicURL={item.profile_picture}
                      />
                    )}
                    {index === 0 ? (
                      <p className={'text-[#009933] line-clamp-1'}>
                        {item.name}
                      </p>
                    ) : (
                      <p className={'text-[#009933] line-clamp-1'}>
                        {item.name}
                      </p>
                    )}
                  </div>
                  {item.type === 'website' && (
                    <Image
                      src={ltWebsiteIcon}
                      alt="LT Website Icon"
                      quality={100}
                      className="min-w-[21px]"
                    />
                  )}
                  {item.type === 'facebook' && (
                    <Icon_facebook2 className="text-primary my-auto min-w-[21px]" />
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default MostRecentEngagements
