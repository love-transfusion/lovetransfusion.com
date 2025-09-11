'use client'

import { I_TotalEngagements } from './TotalEngagements'

const getFBDataCounts = (
  fbInsights: I_TotalEngagements['fbInsights'],
  facebook_comments_length: number,
  facebook_share_count: number
) => {
  const totalFacebookLikeHugCare = fbInsights?.reduce(
    (sum, item) => sum + item.cl_total_reactions,
    0
  )
  const totalFBComments = facebook_comments_length
  const totalFBShares = facebook_share_count ?? 0
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
