'use client'
import { getNetworkCount } from '@/app/(logged-in-pages)/dashboard/[user_id]/getNetworkCounts'
import { AdInsight } from '@/app/utilities/facebook/util_fb_insights'
import React from 'react'

interface I_Engagements_Types {
  users_data_facebook: I_supa_users_data_facebook_row | undefined
  recipient: Pick<
    I_supaorg_recipient_hugs_counters_comments,
    'comments' | 'hugs' | 'recipient_counters'
  >
}

const Engagements = ({
  users_data_facebook,
  recipient,
}: I_Engagements_Types) => {
  const fbInsights = users_data_facebook?.insights as AdInsight[] | undefined
  const { totalFacebookData } = fbInsights
    ? getNetworkCount.fbCounts(fbInsights, users_data_facebook)
    : { totalFacebookData: 0 }

  const { total: totalOrgWebsite } = getNetworkCount.orgCounts(recipient)
  return <p className={''}>{totalOrgWebsite + totalFacebookData}</p>
}

export default Engagements
