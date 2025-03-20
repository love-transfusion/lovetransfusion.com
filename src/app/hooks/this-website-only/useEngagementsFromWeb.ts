'use client'

type I_recipient = I_supaorg_recipient & {
  hugs: I_supaorg_hug[]
  recipient_counters: I_supaorg_recipient_counters | null
  comments: I_supaorg_comments[]
}

const useEngagementsFromWeb = (recipient: I_supaorg_recipient) => {
  const extendedRecipient = recipient as I_recipient
  const comments = extendedRecipient.comments.length
  const hugs = extendedRecipient.hugs.length
  const shares = extendedRecipient.recipient_counters?.shares ?? 0
  const total = comments + hugs + shares
  return { comments, hugs, shares, total }
}

export default useEngagementsFromWeb
