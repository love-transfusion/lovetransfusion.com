// useMenu_Fixed.tsx
'use client'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import useDeviceSize from './useDeviceSize'
import { twMerge } from 'tailwind-merge'

interface I_Menu {
  children: React.ReactNode
  clArrowStyles?: string
  clDisableArrow?: boolean
  className?: string
  clIsAbsolute?: boolean
}

const useMenu_Fixed = <T extends HTMLElement = HTMLElement>() => {
  const [clIsOpen, setclIsOpen] = useState(false)
  const { clDeviceSize } = useDeviceSize()

  const [menuPosition, setMenuPosition] = useState({
    posTop: 0,
    posLeft: 0,
    arrowLeft: 0,
    arrowTop: 0,
    isArrowOnTop: false,
  })

  const clRef = useRef<T | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Deterministic toggler
  const clToggleMenu = useCallback((bool?: boolean) => {
    setclIsOpen((prev) => (typeof bool === 'boolean' ? bool : !prev))
  }, [])

  const closeMenu = useCallback(() => setclIsOpen(false), [])

  const handleOutsidePointerDown = useCallback(
    (e: PointerEvent) => {
      const target = e.target as Node
      const anchor = clRef.current
      const menu = menuRef.current
      if (!anchor || !menu) return
      const clickInsideAnchor = anchor.contains(target)
      const clickInsideMenu = menu.contains(target)
      if (!clickInsideAnchor && !clickInsideMenu) {
        // IMPORTANT: explicitly close; do not toggle
        closeMenu()
      }
    },
    [closeMenu]
  )

  // Positioning
  useLayoutEffect(() => {
    if (!clIsOpen) return

    const calculatePosition = () => {
      if (!clRef.current) return
      const {
        top,
        left,
        height: buttonHeight,
        width: buttonWidth,
      } = clRef.current.getBoundingClientRect()
      const modalWidth = menuRef.current ? menuRef.current.offsetWidth : 0
      const modalHeight = menuRef.current ? menuRef.current.offsetHeight : 0
      const viewportWidth = document.documentElement.offsetWidth
      const viewportHeight = document.documentElement.clientHeight
      const scrollableWidth = document.documentElement.scrollWidth
      const scrollableHeight = document.documentElement.offsetHeight
      const buttonHalfWidth = buttonWidth / 2
      const modalHalfWidth = modalWidth / 2

      let arrowLeft = 0
      let arrowTop = 0
      let posTop = 0
      let posLeft = 0
      let isArrowOnTop = false
      const marginX = 10
      const marginY = 10

      const isRightPositioned =
        viewportWidth - (left + buttonHalfWidth) < modalHalfWidth + marginX
      const isRightPositionedMobile =
        scrollableWidth - (left + buttonHalfWidth) < modalHalfWidth + marginX
      const remaining =
        (clDeviceSize === 'sm' ? scrollableWidth : viewportWidth) -
        (left + buttonHalfWidth)

      const isTopPositioned =
        top + modalHeight + buttonHeight + marginY + 5 >
        (clDeviceSize === 'sm' ? scrollableHeight : viewportHeight)

      if (clDeviceSize === 'sm' ? isRightPositionedMobile : isRightPositioned) {
        if (clDeviceSize === 'sm') {
          posLeft = scrollableWidth - modalWidth - marginX
          arrowLeft = modalWidth + marginX - remaining - 10
        } else {
          posLeft = viewportWidth - modalWidth - marginX
          arrowLeft = modalWidth + marginX - remaining - 10
        }
      } else if (left + buttonHalfWidth < modalHalfWidth + marginX) {
        posLeft = marginX
        arrowLeft = left - marginX + (buttonHalfWidth - 10)
      } else {
        posLeft = left + buttonHalfWidth - modalHalfWidth
        arrowLeft = modalHalfWidth - 10
      }

      if (isTopPositioned) {
        posTop = top - modalHeight - marginY - 1
        arrowTop = modalHeight - 8
        isArrowOnTop = true
      } else {
        posTop = top + buttonHeight + marginY + 1
        arrowTop = -8
      }

      setMenuPosition({ posTop, posLeft, arrowLeft, arrowTop, isArrowOnTop })
    }

    // initial + on resize only while open
    calculatePosition()
    const onResize = () => calculatePosition()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [clIsOpen, clDeviceSize])

  // Outside click only when open, and with pointerdown (more reliable)
  useEffect(() => {
    if (!clIsOpen) return
    document.addEventListener('pointerdown', handleOutsidePointerDown, true)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener(
        'pointerdown',
        handleOutsidePointerDown,
        true
      )
      document.removeEventListener('keydown', onKey)
    }
  }, [clIsOpen, handleOutsidePointerDown, closeMenu])

  const Menu = ({
    children,
    clArrowStyles,
    clDisableArrow,
    className,
  }: I_Menu) => {
    if (!clIsOpen) return null
    return (
      <div className="relative z-[990]">
        <div
          ref={menuRef}
          style={{
            top: `${menuPosition.posTop}px`,
            left: `${menuPosition.posLeft}px`,
          }}
          className="fixed bottom-2 right-2 w-fit h-fit shadow-md rounded-md"
          // prevent accidental bubbling to document handlers in some edge cases
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {!clDisableArrow && (
              <div
                className={twMerge(
                  'size-4 absolute rotate-45 bg-white -z-10',
                  clArrowStyles
                )}
                style={{
                  borderLeft: menuPosition.isArrowOnTop ? 'none' : undefined,
                  borderTop: menuPosition.isArrowOnTop ? 'none' : undefined,
                  borderRight: !menuPosition.isArrowOnTop ? 'none' : undefined,
                  borderBottom: !menuPosition.isArrowOnTop ? 'none' : undefined,
                  left: `${menuPosition.arrowLeft}px`,
                  top: `${menuPosition.arrowTop}px`,
                }}
              />
            )}
            <div
              className={twMerge(
                'w-full h-full bg-white overflow-hidden p-2 rounded-sm',
                className
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return { Menu, clToggleMenu, clIsOpen, clRef }
}

export default useMenu_Fixed