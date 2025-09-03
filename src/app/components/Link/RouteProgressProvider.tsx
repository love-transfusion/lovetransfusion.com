/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import dynamic from 'next/dynamic'

// Lazy-load only when visible (keeps framer-motion out of main bundle)
const LoadingBar = dynamic(() => import('@/app/components/Link/LoadingBar'), {
  ssr: false,
})

type Ctx = { start: () => void; stop: () => void }
const RouteProgressCtx = createContext<Ctx | null>(null)

/**
 * @returns
 * `{start, stop}`
 */
export const useRouteProgress = () => {
  const ctx = useContext(RouteProgressCtx)
  if (!ctx)
    throw new Error(
      'useRouteProgress must be used within RouteProgressProvider'
    )
  return ctx
}

function getUrlKey(): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.pathname}${window.location.search}`
}

export function RouteProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [visible, setVisible] = useState(false)

  // timers/state refs
  const delayRef = useRef<number | null>(null)
  const minShowRef = useRef<number | null>(null)
  const hardTimeoutRef = useRef<number | null>(null)
  const startedAtRef = useRef<number | null>(null)
  const startedRef = useRef(false)
  const prevUrlKey = useRef<string>('')

  const clearTimer = (r: React.MutableRefObject<number | null>) => {
    if (r.current) {
      window.clearTimeout(r.current)
      r.current = null
    }
  }
  const clearAllTimers = () => {
    clearTimer(delayRef)
    clearTimer(minShowRef)
    clearTimer(hardTimeoutRef)
  }

  const stopNow = useCallback(() => {
    clearTimer(hardTimeoutRef)
    setVisible(false)
    startedAtRef.current = null
    startedRef.current = false
  }, [])

  const stop = useCallback(() => {
    const MIN_VISIBLE_MS = 300
    const startedAt = startedAtRef.current
    if (!startedAt) return stopNow()

    const elapsed = Date.now() - startedAt
    if (elapsed >= MIN_VISIBLE_MS) {
      stopNow()
    } else if (!minShowRef.current) {
      minShowRef.current = window.setTimeout(
        stopNow,
        MIN_VISIBLE_MS - elapsed
      ) as unknown as number
    }
  }, [stopNow])

  const start = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true

    clearAllTimers()
    const DELAY_MS = 80 // avoid flash on instant navs
    delayRef.current = window.setTimeout(() => {
      startedAtRef.current = Date.now()
      setVisible(true)
    }, DELAY_MS) as unknown as number

    // safety stop in case of route errors
    hardTimeoutRef.current = window.setTimeout(
      stop,
      60 * 1000
    ) as unknown as number
  }, [stop])

  // --- URL change observer (no useSearchParams, no Suspense) ---
  useEffect(() => {
    if (typeof window === 'undefined') return

    // initialize
    prevUrlKey.current = getUrlKey()

    // patch history methods to emit a custom event
    const origPush = history.pushState
    const origReplace = history.replaceState
    const dispatch = () => window.dispatchEvent(new Event('urlchange'))

    history.pushState = function (...args) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ret = origPush.apply(this, args as any)
      dispatch()
      return ret
    }
    history.replaceState = function (...args) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ret = origReplace.apply(this, args as any)
      dispatch()
      return ret
    }

    // update on back/forward and our custom event
    let rafId: number | null = null
    const onChange = () => {
      // collapse multiple events in the same tick
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const nextKey = getUrlKey()
        if (nextKey !== prevUrlKey.current) {
          prevUrlKey.current = nextKey
          clearAllTimers()
          stop()
        }
      })
    }

    window.addEventListener('popstate', onChange)
    window.addEventListener('urlchange', onChange)

    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener('urlchange', onChange)
      if (rafId) cancelAnimationFrame(rafId)
      // restore originals to be nice in dev/HMR
      history.pushState = origPush
      history.replaceState = origReplace
      clearAllTimers()
    }
  }, [stop])

  const ctxValue = useMemo<Ctx>(() => ({ start, stop }), [start, stop])

  return (
    <RouteProgressCtx.Provider value={ctxValue}>
      {visible && <LoadingBar />}
      {children}
    </RouteProgressCtx.Provider>
  )
}
