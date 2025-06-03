'use client'

import React, {
  useLayoutEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { twMerge } from 'tailwind-merge'

interface I_Menu {
  children: ReactNode
  clArrowStyles?: string
  clDisableArrow?: boolean
  className?: string
  mainContainerClassName?: string
}

interface MenuContainerTypes {
  children: ReactNode
  className?: string
}

const useMenu2 = (disableBackgroundClick?: boolean, arrowSize?: number) => {
  const halfArrowSize = arrowSize ? arrowSize / 2 : 8
  const clRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [clIsOpen, setclIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    arrowLeft: 0,
    arrowTop: 0,
    isArrowOnTop: false,
  })

  const clToggleMenu = (bool?: boolean) => {
    setclIsOpen((prev) => (typeof bool === 'boolean' ? bool : !prev))
  }

  const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as Node
    if (
      clRef.current &&
      !clRef.current.contains(target) &&
      menuRef.current &&
      !menuRef.current.contains(target)
    ) {
      if (!disableBackgroundClick) {
        setclIsOpen(false)
      }
    }
  }

  useLayoutEffect(() => {
    const calculatePosition = () => {
      if (!clRef.current || !menuRef.current) return

      const trigger = clRef.current.getBoundingClientRect()
      const menu = menuRef.current.getBoundingClientRect()

      let top
      let arrowTop
      let left
      let arrowLeft
      const containerHeightFromTop = trigger.y

      const viewportWidth = document.documentElement.offsetWidth
      const viewportHeight = document.documentElement.clientHeight
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const scrollableWidth = document.documentElement.scrollWidth
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const scrollableHeight = document.documentElement.offsetHeight

      if (
        containerHeightFromTop + trigger.height + menu.height + 8 >
        viewportHeight
      ) {
        // MenuContainer must be on Top
        top = -menu.height - halfArrowSize
        arrowTop = menu.height - halfArrowSize
      } else {
        // MenuContainer must be on Bottom
        top = trigger.height + halfArrowSize
        arrowTop = -halfArrowSize
      }

      // MenuContainer must be left aligned
      if (trigger.x + menu.width > viewportWidth - 5) {
        // entered clamp right
        const maxLeft = viewportWidth - menu.width - trigger.x - 5
        left = maxLeft
        arrowLeft =
          trigger.x + trigger.width / 2 - (trigger.x + maxLeft) - halfArrowSize
      } else if (trigger.x < menu.width / 2 && menu.width > trigger.width) {
        // entered clamp left
        left = 0
        arrowLeft = trigger.width / 2 - halfArrowSize - 5
      } else {
        // entered center
        left = trigger.width / 2 - menu.width / 2
        arrowLeft = menu.width / 2 - halfArrowSize
      }

      setMenuPosition({
        top,
        left,
        arrowLeft,
        arrowTop,
        isArrowOnTop: false,
      })
    }

    if (clIsOpen) calculatePosition()

    window.addEventListener('resize', calculatePosition)
    document.addEventListener('click', handleOutsideClick)

    return () => {
      window.removeEventListener('resize', calculatePosition)
      document.removeEventListener('click', handleOutsideClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clIsOpen, disableBackgroundClick])

  const Menu = ({
    children,
    clArrowStyles,
    clDisableArrow,
    mainContainerClassName,
    className,
  }: I_Menu) => {
    if (!clIsOpen) return null
    return (
      <div
        ref={menuRef}
        className={twMerge('absolute z-50', mainContainerClassName)}
        style={{ top: menuPosition.top, left: menuPosition.left }}
      >
        <div className="relative">
          {!clDisableArrow && (
            <div
              className={twMerge(
                'size-4 absolute rotate-45 bg-neutral-100 -z-10',
                clArrowStyles
              )}
              style={{
                left: menuPosition.arrowLeft,
                top: menuPosition.arrowTop,
                transform: 'rotate(45deg)',
              }}
            />
          )}
          <div className={twMerge('bg-white p-2 rounded shadow-md', className)}>
            {children}
          </div>
        </div>
      </div>
    )
  }

  // 🧠 Wrap the container with clRef internally
  const MenuContainer = useCallback(
    ({ children, className }: MenuContainerTypes) => {
      return (
        <div ref={clRef} className={twMerge('relative', className)}>
          {children}
        </div>
      )
    },
    []
  )

  return {
    Menu,
    clToggleMenu,
    clIsOpen,
    ClMenuContainer: MenuContainer,
  }
}

export default useMenu2
