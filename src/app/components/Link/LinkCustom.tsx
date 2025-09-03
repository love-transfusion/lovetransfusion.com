'use client'

import Link, { LinkProps } from 'next/link'
import React, {
  MouseEvent,
  PointerEvent,
  KeyboardEvent,
  PropsWithChildren,
  forwardRef,
  useCallback,
  useRef,
} from 'react'
import { useRouteProgress } from './RouteProgressProvider'

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>
type Props = PropsWithChildren<LinkProps & AnchorProps>

function isModified(
  e: MouseEvent<HTMLAnchorElement> | PointerEvent<HTMLAnchorElement>
) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
}
function isLeftButton(
  e: MouseEvent<HTMLAnchorElement> | PointerEvent<HTMLAnchorElement>
) {
  return (e.button ?? 0) === 0
}
function isHashOnly(href: LinkProps['href']) {
  return typeof href === 'string' && href.startsWith('#')
}
function getCurrentKey() {
  if (typeof window === 'undefined') return ''
  return `${window.location.pathname}?${window.location.search.slice(1)}`
}
function toAbsolute(href: LinkProps['href']): URL | null {
  try {
    if (typeof href === 'string') return new URL(href, window.location.href)
    const path = href.pathname ?? ''
    const search =
      href.query && Object.keys(href.query).length
        ? `?${new URLSearchParams(
            href.query as Record<string, string>
          ).toString()}`
        : ''
    const hash = href.hash ? `#${String(href.hash).replace(/^#/, '')}` : ''
    return new URL(`${path}${search}${hash}`, window.location.href)
  } catch {
    return null
  }
}

const DRAG_THRESHOLD_PX = 5

const LinkCustom = forwardRef<HTMLAnchorElement, Props>(function LinkCustom(
  {
    href,
    children,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerCancel,
    onKeyDown,
    target,
    download,
    ...rest
  },
  ref
) {
  const { start } = useRouteProgress()

  const pressStart = useRef<{ x: number; y: number } | null>(null)
  const draggedRef = useRef(false)

  const shouldTrigger = useCallback(
    (
      absTarget: URL | null,
      e?: MouseEvent<HTMLAnchorElement> | PointerEvent<HTMLAnchorElement>
    ) => {
      if (e) {
        if (!isLeftButton(e)) return false
        if (isModified(e)) return false
      }
      if (target && target !== '_self') return false
      if (download) return false
      if (isHashOnly(href)) return false
      if (!absTarget) return false
      // external?
      if (absTarget.origin !== window.location.origin) return false

      // same path+query? don't start
      const currentKey = getCurrentKey()
      const targetKey = `${absTarget.pathname}?${absTarget.search.slice(1)}`
      if (targetKey === currentKey) return false

      return true
    },
    [download, href, target]
  )

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      onPointerDown?.(e)
      if (!isLeftButton(e) || isModified(e)) return
      pressStart.current = { x: e.clientX, y: e.clientY }
      draggedRef.current = false
    },
    [onPointerDown]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      onPointerMove?.(e)
      if (!pressStart.current) return
      const dx = e.clientX - pressStart.current.x
      const dy = e.clientY - pressStart.current.y
      if (dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
        draggedRef.current = true
      }
    },
    [onPointerMove]
  )

  const endPointerTracking = () => {
    pressStart.current = null
  }

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      onPointerCancel?.(e)
      endPointerTracking()
    },
    [onPointerCancel]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      onPointerUp?.(e)
      const abs = toAbsolute(href)
      if (!draggedRef.current && pressStart.current && shouldTrigger(abs, e)) {
        start()
      }
      endPointerTracking()
    },
    [href, onPointerUp, shouldTrigger, start]
  )

  // Keyboard activation (Enter/Space)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLAnchorElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented) return
      const key = e.key.toLowerCase()
      if (key !== 'enter' && key !== ' ') return
      const abs = toAbsolute(href)
      if (shouldTrigger(abs)) start()
    },
    [href, onKeyDown, shouldTrigger, start]
  )

  // Click fallback
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e)
      if (e.defaultPrevented) return
      const abs = toAbsolute(href)
      if (shouldTrigger(abs, e)) start()
    },
    [href, onClick, shouldTrigger, start]
  )

  return (
    <Link
      ref={ref}
      href={href}
      target={target}
      download={download}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  )
})

export default LinkCustom
