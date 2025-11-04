import React from 'react'
import { I_Comments } from '@/types/Comments.types'
import Engagements from './Engagements'
interface I_MostRecentEngagements {
  allEngagements: I_Comments[]
  user_id: string
}

const MostRecentEngagements = ({
  allEngagements,
  user_id,
}: I_MostRecentEngagements) => {
  return (
    <div
      className={
        'pl-4 md:pl-[39px] xl:pl-[10px] pr-4 md:pr-[39px] xl:pr-6 2xl:pr-[18px] pt-[3px] -mt-[6px] max-h-[586px] md:min-w-[337px] lg:min-w-[640px] xl:min-w-[290px] 2xl:min-w-[337px] overflow-hidden relative mx-auto'
      }
    >
      <div
        className={
          'h-[150px] w-full  bg-gradient-to-b from-white/0 from-[0%] via-white/40 via-[70%] to-white/100 to-[90%] -left-2 absolute -bottom-4 z-10'
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
        <Engagements allEngagements={allEngagements} user_id={user_id} />
      </div>
    </div>
  )
}

export default MostRecentEngagements
