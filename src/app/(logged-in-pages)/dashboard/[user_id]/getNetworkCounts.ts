'use client'

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
  orgCounts: getRecipientsDataCounts,
}
