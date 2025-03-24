'use client'

const useEngagementsFromWeb = (recipient: I_supaorg_recipient) => {
  const extendedRecipient =
    recipient as I_supaorg_recipient_hugs_counters_comments
  const comments = extendedRecipient.comments.length
  const hugs = extendedRecipient.hugs.length
  const shares = extendedRecipient.recipient_counters?.shares ?? 0
  const total = comments + hugs + shares
  return { comments, hugs, shares, total }
}

export default useEngagementsFromWeb
