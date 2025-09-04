'use client'
import React from 'react'
import Image from 'next/image'
import hugs from './images/hugs.png'
import messages from './images/MESSAGES.png'
import shares from './images/SHARES.png'
import ripple from './images/ripple.png'
import useTooltip from '@/app/hooks/this-website-only/useTooltips'
import { AdWiseInsight } from '@/app/utilities/facebook/util_fb_insights'
import { getNetworkCount } from './getNetworkCounts'
import { I_supa_select_user_Response_Types } from '@/app/_actions/users/actions'

export interface I_fb_comments_Types {
  id: string
  message: string
  created_time: string
  from?: {
    name: string
    id: string
  }
}

interface I_HugsMessagesShares {
  selectedUser: I_supa_select_user_Response_Types
  users_data_facebook: I_supa_users_data_facebook_row | null
  fbInsights: [] | AdWiseInsight[]
}

const HugsMessagesShares = ({
  selectedUser,
  users_data_facebook,
  fbInsights,
}: I_HugsMessagesShares) => {
  const {
    hugs: totalHugs,
    comments: totalComments,
    shares: totalShares,
    total,
  } = getNetworkCount.orgCounts(selectedUser.users_data_website[0].recipient)

  const { Tooltip: ToolTipTotal } = useTooltip({
    clTooltipTitle: 'Updates',
    clUser_id: selectedUser.id,
  })
  const { Tooltip } = useTooltip({
    clTooltipTitle: 'Engagements',
    clUser_id: selectedUser.id,
  })
  const {
    hugs: fbHugsCount,
    comments: fbCommentsCount,
    shares: fbSharesCount,
    totalFacebookData,
  } = getNetworkCount.fbCounts(fbInsights, users_data_facebook)
  return (
    <div
      className={
        'flex flex-col md:flex-row gap-3 2xl:gap-6 pl-3 pr-3 md:pl-[15px] justify-center'
      }
    >
      <ToolTipTotal
        clContainerClassName="block md:hidden"
        clScrollTo_IDOrClass=".supporters-tooltip"
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
              {total + totalFacebookData}
            </p>
          </div>
        </div>
      </ToolTipTotal>
      <div className={'text-center'}>
        <p className={'uppercase text-xl 2xl:text-2xl text-[#C5DFEF]'}>hugs</p>
        <Tooltip clContainerClassName="text-left">
          <div
            className={
              'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-4 2xl:px-6 mt-[7px] md:mt-5 rounded-lg w-fit mx-auto text-center'
            }
          >
            <Image src={hugs} quality={100} alt="hugs" />
            <p
              className={
                'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-xl 2xl:text-[26px] pt-[10px] 2xl:pt-[6px] pb-[9px] 2xl:pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
              }
            >
              {totalHugs + fbHugsCount}
            </p>
          </div>
        </Tooltip>
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
            {totalComments + fbCommentsCount}
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
            {totalShares + fbSharesCount}
          </p>
        </div>
      </div>
    </div>
  )
}

export default HugsMessagesShares
