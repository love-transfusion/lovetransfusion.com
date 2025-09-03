'use client'
import Image from 'next/image'
import React from 'react'
import ripple from './images/ripple.png'
import useTooltip from '@/app/hooks/this-website-only/useTooltips'
import { AdWiseInsight } from '@/app/utilities/facebook/util_facebookApi'
import { getNetworkCount } from './getNetworkCounts'
import { I_supa_select_user_Response_Types } from '@/app/_actions/users/actions'
// import { useStore } from 'zustand'
// import utilityStore from '@/app/utilities/store/utilityStore'

export interface I_TotalEngagements {
  selectedUser: I_supa_select_user_Response_Types
  fbInsights: [] | AdWiseInsight[]
  users_data_facebook: I_supa_users_data_facebook_row | null
}

const TotalEngagements = ({ 
  selectedUser,
  fbInsights,
  users_data_facebook,
}: I_TotalEngagements) => {
  const { total: totalOrgRecipientData } = getNetworkCount.orgCounts(
    selectedUser.users_data_website[0].recipient
  )
  const { Tooltip } = useTooltip({
    clTooltipTitle: 'Updates',
    clUser_id: selectedUser.id,
  })

  const { totalFacebookData } = getNetworkCount.fbCounts(
    fbInsights,
    users_data_facebook
  )

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
      <Tooltip
        clContainerClassName="text-black text-left"
        clArrowStylesCustom="bg-white"
        clScrollTo_IDOrClass=".supporters-tooltip"
      >
        <div className={'text-white text-center'}>
          <p className={'max-sm:text-[12px]'}>TOTAL</p>
          <p
            className={
              'font-acuminProSemibold text-sm md:text-2xl 2xl:text-[36px] leading-tight -mt-[2px]'
            }
          >
            {totalOrgRecipientData + totalFacebookData}
          </p>
        </div>
      </Tooltip>
    </div>
  )
}

export default TotalEngagements
