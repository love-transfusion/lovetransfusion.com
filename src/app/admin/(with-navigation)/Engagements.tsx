'use client'
import { getNetworkCount } from '@/app/(logged-in-pages)/dashboard/[user_id]/getNetworkCounts'
import { I_fbData } from '@/app/(logged-in-pages)/dashboard/[user_id]/HugsMessagesShares'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'
import React from 'react'

interface I_Engagements_Types {
  fb_data: I_fbData
  recipient: I_supaorg_recipient
}

const Engagements = ({ recipient, fb_data }: I_Engagements_Types) => {
  const totalFacebookData =
    fb_data.total_shares + fb_data.total_comments + fb_data.total_reactions
  const { total: totalOrgWebsite } = getNetworkCount.orgCounts(recipient)
  return <p className={''}>{totalOrgWebsite + totalFacebookData}</p>
}

export default Engagements
