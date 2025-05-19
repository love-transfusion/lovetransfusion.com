'use client'
import useEngagementsFromWeb from '@/app/hooks/this-website-only/useEngagementsFromWeb'
import React from 'react'

const Engagements = ({
  recipient,
  totalFBReactions,
}: {
  recipient: I_supaorg_recipient_hugs_counters_comments
  totalFBReactions: number | undefined
}) => {
  const { total } = useEngagementsFromWeb(recipient)
  return <p className={''}>{total + (totalFBReactions ?? 0)}</p>
}

export default Engagements
