'use client'
import Image from 'next/image'
import React from 'react'
import ripple from './images/ripple.png'
import useEngagementsFromWeb from '@/app/hooks/this-website-only/useEngagementsFromWeb'

const TotalEngagements = ({
  clRecipientOBj,
}: {
  clRecipientOBj: I_supaorg_recipient_hugs_counters_comments
}) => {
  const { total } = useEngagementsFromWeb(clRecipientOBj)
  return (
    <div
      className={
        'grid grid-cols-[auto_1fr] md:grid-cols-[70px_1fr] w-fit text-white bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] shadow-[0px_0px_30px_0px_#288CCC47] rounded-lg gap-2 md:gap-4 px-2 md:px-[13px] py-[4px] md:mt-[90px] z-10 md:absolute right-0 left-0 mx-auto md:min-w-[172px] items-center text-left md:text-center'
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
          {total}
        </p>
      </div>
    </div>
  )
}

export default TotalEngagements
