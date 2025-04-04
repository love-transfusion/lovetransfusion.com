'use client'
import useEngagementsFromWeb from '@/app/hooks/this-website-only/useEngagementsFromWeb'
import React from 'react'

const Engagements = ({
  recipient,
}: {
  recipient: I_supaorg_recipient_hugs_counters_comments
}) => {
  const { total } = useEngagementsFromWeb(recipient)
  return <p className={''}>{total}</p>
}

export default Engagements
