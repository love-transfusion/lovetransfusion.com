'use client'

import { I_fb_comments_Types } from './HugsMessagesShares'
import { I_TotalEngagements } from './TotalEngagements'

const getFBDataCounts = (
  fbInsights: I_TotalEngagements['fbInsights'],
  users_data_facebook: I_TotalEngagements['users_data_facebook'] | undefined
) => {
  const totalFacebookLikeHugCare = fbInsights?.reduce(
    (sum, item) => sum + item.cl_total_reactions,
    0
  )
  const fbComments = users_data_facebook?.comments as
    | I_fb_comments_Types[]
    | undefined
  const totalFBComments = fbComments?.length ?? 0
  const totalFBShares = users_data_facebook?.share_count ?? 0
  const totalFacebookData =
    totalFBComments + totalFBShares + totalFacebookLikeHugCare

  return {
    comments: totalFBComments,
    shares: totalFBShares,
    hugs: totalFacebookLikeHugCare,
    totalFacebookData,
  }
}

const getRecipientsDataCounts = (
  recipient: Pick<
    I_supaorg_recipient_hugs_counters_comments,
    'comments' | 'hugs' | 'recipient_counters'
  >
) => {
  const comments = recipient.comments.length
  const hugs = recipient.hugs.length
  const shares = recipient.recipient_counters?.shares ?? 0
  const total = comments + hugs + shares
  return { comments, hugs, shares, total }
}

export const getNetworkCount = {
  fbCounts: getFBDataCounts,
  orgCounts: getRecipientsDataCounts,
}
