// app/prayer-notify/useAudio.ts
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * useAudio
 * - Auto-unlocks after first real user gesture (pointerdown/keydown)
 * - Queues play() calls that happen before unlock
 * - Rate-limits rapid consecutive plays to avoid overlap
 */
const useAudio = (src: string, rateLimitMs = 600) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const lastPlayAtRef = useRef(0)
  const pendingRef = useRef(0)

  // Create the Audio object only in the browser
  const audio = useMemo(() => {
    if (typeof window === 'undefined') return null
    const a = new Audio(src)
    a.preload = 'auto'
    return a
  }, [src])

  useEffect(() => {
    if (!audio) return

    audioRef.current = audio
    audio.load()

    const unlock = async () => {
      if (!audioRef.current || isUnlocked) return
      try {
        // Perform a muted play in direct response to the user gesture
        audioRef.current.muted = true
        await audioRef.current.play()
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.muted = false
        setIsUnlocked(true)

        // Drain any queued plays
        while (pendingRef.current > 0) {
          pendingRef.current--
          await playNow()
        }
      } catch {
        // Ignore; if the gesture wasn't valid, the listeners remain
      }
    }

    // Unlock on first real interaction anywhere
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      audio.pause()
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, isUnlocked])

  const playNow = async () => {
    const a = audioRef.current
    if (!a) return
    const now = Date.now()
    if (now - lastPlayAtRef.current < rateLimitMs) return
    lastPlayAtRef.current = now
    try {
      await a.play()
    } catch (e) {
      // Should not fail after unlock; swallow to avoid breaking handlers
      console.warn('play failed', e)
    }
  }

  const play = async () => {
    console.log('playing audio, start')
    if (!audioRef.current) {
      console.log('!audioRef.current')
      return
    }
    if (!isUnlocked) {
      console.log('!isUnlocked')
      // Queue the play; will auto-play right after first user gesture
      pendingRef.current++
      return
    }
    console.log('playing audio')
    await playNow()
  }

  return { clPlay: play, clIsUnlocked: isUnlocked }
}

export default useAudio
