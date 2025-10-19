// app/prayer-notify/Notify.tsx
'use client'

import { useEffect } from 'react'
import useAudio from '../hooks/useAudio'
import { createClient } from '../config/supabase/supabaseClient'

type Props = {
  // Optional: filter by a single recipient
  recipientId?: string
}

const Notify = ({ recipientId }: Props) => {
  const { clPlay } = useAudio('/audio/church-bell.mp3', 1000)

  const handleInsert = () => {
    clPlay()
  }

  useEffect(() => {
    let cleanup: (() => void) | undefined

    const init = async () => {
      const supabase = await createClient()

      const channel = supabase
        .channel('recipient_prays')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'recipient_prays',
            ...(recipientId
              ? { filter: `recipient_id=eq.${recipientId}` }
              : {}),
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (payload) => {
            // Play tone when a new prayer is inserted
            handleInsert()
          }
        )
        .subscribe()

      cleanup = () => supabase.removeChannel(channel)
    }

    void init()
    return () => cleanup?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clPlay, recipientId])

  return <div className="flex items-center gap-3"></div>
}

export default Notify
