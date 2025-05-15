'use client'
import React from 'react'
import Image from 'next/image'
import hugs from './images/hugs.png'
import messages from './images/MESSAGES.png'
import shares from './images/SHARES.png'
import ripple from './images/ripple.png'
import useEngagementsFromWeb from '@/app/hooks/this-website-only/useEngagementsFromWeb'

interface I_HugsMessagesShares {
  clRecipientObj: I_supaorg_recipient_hugs_counters_comments
  totalFacebookLikeHugCare: number
}

const HugsMessagesShares = ({
  clRecipientObj,
  totalFacebookLikeHugCare,
}: I_HugsMessagesShares) => {
  const {
    hugs: totalHugs,
    comments: totalComments,
    shares: totalShares,
    total,
  } = useEngagementsFromWeb(clRecipientObj)
  return (
    <div
      className={
        'flex flex-col md:flex-row gap-3 2xl:gap-6 pl-3 pr-3 md:pl-[15px] justify-center'
      }
    >
      <div className={'block md:hidden text-center '}>
        <p className={'uppercase text-xl 2xl:text-2xl text-primary-300'}>
          Total
        </p>
        <div
          className={
            'flex gap-3 items-center text-white bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-4 2xl:px-6 mt-[7px] md:mt-5 rounded-lg w-fit mx-auto'
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
          <p
            className={
              'rounded-lg text-white ring-[1px] ring-primary-300 text-xl 2xl:text-[26px] pt-[10px] 2xl:pt-[6px] pb-[9px] 2xl:pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
            }
          >
            {total + totalFacebookLikeHugCare}
          </p>
        </div>
      </div>
      <div className={'text-center'}>
        <p className={'uppercase text-xl 2xl:text-2xl text-[#C5DFEF]'}>hugs</p>
        <div
          className={
            'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-4 2xl:px-6 mt-[7px] md:mt-5 rounded-lg w-fit mx-auto'
          }
        >
          <Image src={hugs} quality={100} alt="hugs" />
          <p
            className={
              'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-xl 2xl:text-[26px] pt-[10px] 2xl:pt-[6px] pb-[9px] 2xl:pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
            }
          >
            {totalHugs + totalFacebookLikeHugCare}
          </p>
        </div>
      </div>
      <div className={'text-center'}>
        <p className={'uppercase text-xl 2xl:text-2xl text-[#C5DFEF]'}>
          messages
        </p>
        <div
          className={
            'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-4 2xl:px-6 mt-[7px] md:mt-5 rounded-lg w-fit mx-auto'
          }
        >
          <Image src={messages} quality={100} alt="hugs" />
          <p
            className={
              'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-xl 2xl:text-[26px] pt-[10px] 2xl:pt-[6px] pb-[9px] 2xl:pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
            }
          >
            {totalComments}
          </p>
        </div>
      </div>
      <div className={'text-center'}>
        <p className={'uppercase text-xl 2xl:text-2xl text-[#C5DFEF]'}>
          shares
        </p>
        <div
          className={
            'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-4 2xl:px-6 mt-[7px] md:mt-5 rounded-lg w-fit mx-auto'
          }
        >
          <Image src={shares} quality={100} alt="hugs" />
          <p
            className={
              'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-xl 2xl:text-[26px] pt-[10px] 2xl:pt-[6px] pb-[9px] 2xl:pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
            }
          >
            {totalShares}
          </p>
        </div>
      </div>
    </div>
  )
}

export default HugsMessagesShares
