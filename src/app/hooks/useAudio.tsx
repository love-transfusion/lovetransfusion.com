/* eslint-disable @typescript-eslint/no-explicit-any */
// app/prayer-notify/useAudio.ts
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const normalizeSrc = (src: string) => {
  // Prevent route-relative paths in production
  // "audio/notify.mp3" -> "/audio/notify.mp3"
  // "/audio/notify.mp3" stays the same
  // "https://..." stays the same
  if (/^https?:\/\//i.test(src)) return src
  return src.startsWith('/') ? src : `/${src}`
}

/**
 * useAudio
 * - Auto-unlocks after first real user gesture (pointerdown/keydown/touchend)
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

    const a = new Audio(normalizeSrc(src))
    a.preload = 'auto'
    ;(a as any).playsInline = true

    // Useful production debugging
    a.addEventListener('error', () => {
      console.warn('[useAudio] media error', {
        src: a.src,
        code: a.error?.code, // 2 network / 3 decode / 4 not supported
        message: a.error?.message,
        networkState: a.networkState,
        readyState: a.readyState,
      })
    })

    return a
  }, [src])

  useEffect(() => {
    if (!audio) return

    audioRef.current = audio
    audio.load()

    const playNow = async () => {
      const a = audioRef.current
      if (!a) return
      const now = Date.now()
      if (now - lastPlayAtRef.current < rateLimitMs) return
      lastPlayAtRef.current = now

      try {
        // rewind so repeated plays work consistently
        a.currentTime = 0
        await a.play()
      } catch (e) {
        console.warn('[useAudio] play failed', e, {
          src: a.src,
          networkState: a.networkState,
          readyState: a.readyState,
        })
      }
    }

    const unlock = async () => {
      if (!audioRef.current || isUnlocked) return

      try {
        // Muted play in response to a real gesture
        audioRef.current.muted = true
        await audioRef.current.play()
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.muted = false

        setIsUnlocked(true)

        // ✅ remove listeners only AFTER successful unlock
        window.removeEventListener('pointerdown', unlock, true)
        window.removeEventListener('keydown', unlock, true)
        window.removeEventListener('touchend', unlock, true)

        // Drain queued plays
        while (pendingRef.current > 0) {
          pendingRef.current--
          await playNow()
        }
      } catch (e) {
        // ✅ keep listeners so the next gesture can unlock
        console.warn('[useAudio] unlock failed (will retry next gesture)', e)
      }
    }

    // ✅ Use capture true and NO once:true (prod often fails first attempt)
    window.addEventListener('pointerdown', unlock, true)
    window.addEventListener('keydown', unlock, true)
    window.addEventListener('touchend', unlock, true)

    return () => {
      window.removeEventListener('pointerdown', unlock, true)
      window.removeEventListener('keydown', unlock, true)
      window.removeEventListener('touchend', unlock, true)
      audio.pause()
      audioRef.current = null
    }
  }, [audio, isUnlocked, rateLimitMs])

  const playNow = async () => {
    const a = audioRef.current
    if (!a) return
    const now = Date.now()
    if (now - lastPlayAtRef.current < rateLimitMs) return
    lastPlayAtRef.current = now
    try {
      a.currentTime = 0
      await a.play()
    } catch (e) {
      console.warn('[useAudio] play failed', e, {
        src: a.src,
        networkState: a.networkState,
        readyState: a.readyState,
      })
    }
  }

  const play = async () => {
    if (!audioRef.current) return
    if (!isUnlocked) {
      pendingRef.current++
      return
    }
    await playNow()
  }

  return { clPlay: play, clIsUnlocked: isUnlocked }
}

export default useAudio
