'use client'
import { getNetworkCount } from '@/app/(logged-in-pages)/dashboard/[user_id]/getNetworkCounts'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'
import { AdInsight } from '@/app/utilities/facebook/util_fb_insights'
import React from 'react'

interface I_Engagements_Types {
  fbInsights: AdInsight[]
  recipient: I_supaorg_recipient
  comments_count: number
  share_count: number
}

const Engagements = ({
  fbInsights,
  recipient,
  comments_count,
  share_count,
}: I_Engagements_Types) => {
  const { totalFacebookData } = getNetworkCount.fbCounts(
    fbInsights,
    comments_count,
    share_count
  )

  const { total: totalOrgWebsite } = getNetworkCount.orgCounts(recipient)
  return <p className={''}>{totalOrgWebsite + totalFacebookData}</p>
}

export default Engagements
