'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import ripple from './images/ripple.png'
import useEngagementsFromWeb from '@/app/hooks/this-website-only/useEngagementsFromWeb'
// import { useStore } from 'zustand'
// import utilityStore from '@/app/utilities/store/utilityStore'

interface I_TotalEngagements {
  clRecipientOBj: I_supaorg_recipient_hugs_counters_comments
  clUserAccount: I_supa_users_data_website_row
}

const TotalEngagements = ({
  clRecipientOBj,
  clUserAccount,
}: I_TotalEngagements) => {
  // const { setuserInStore } = useStore(utilityStore)
  const { total } = useEngagementsFromWeb(clRecipientOBj)
  useEffect(() => {
    if (clRecipientOBj && clUserAccount) {
      // setuserInStore({
      //   id: clUserAccount.user_id ?? '',
      //   first_name: clRecipientOBj.first_name ?? '',
      //   parent_name: clRecipientOBj.parent_name ?? '',
      //   recipient_id: clRecipientOBj.id,
      // })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div
      className={
        'grid grid-cols-[auto_1fr] md:grid-cols-[70px_1fr] w-fit text-white bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] shadow-[0px_0px_30px_0px_#288CCC47] rounded-lg gap-2 md:gap-[21px] px-2 md:px-5 py-[6px] md:mt-[100px] z-10 md:absolute right-0 left-0 mx-auto md:min-w-[172px] items-center text-left md:text-center'
      }
    >
      <Image
        src={ripple}
        alt="ripple"
        quality={100}
        width={70}
        height={68}
        className="w-10 h-10 md:w-[70px] md:h-[68px]"
      />
      <div className={''}>
        <p className={'max-sm:text-[12px]'}>TOTAL</p>
        <p
          className={
            'font-acuminProSemibold text-sm md:text-2xl 2xl:text-[36px] leading-tight -mt-[2px]'
          }
        >
          {/* {total} */}
          627
        </p>
      </div>
    </div>
  )
}

export default TotalEngagements
