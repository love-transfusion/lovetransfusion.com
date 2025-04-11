'use client'
import React, { useLayoutEffect, useRef, useState } from 'react'
import useDeviceSize from './useDeviceSize'
import { twMerge } from 'tailwind-merge'

interface I_Menu {
  children: React.ReactNode
  clArrowStyles?: string
  clDisableArrow?: boolean
  className?: string
}

const useMenu = <T extends HTMLElement = HTMLElement>() => {
  const [clIsOpen, setclIsOpen] = useState<boolean>(false)
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

  const clToggleMenu = (bool?: boolean) => {
    if (bool === false) {
      setclIsOpen(bool)
    } else {
      setclIsOpen((prev) => !prev)
    }
  }

  const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as Node
    if (
      clRef.current &&
      !clRef.current.contains(target) &&
      menuRef.current &&
      !menuRef.current.contains(target)
    ) {
      clToggleMenu()
    }
  }

  useLayoutEffect(() => {
    const calculatePosition = () => {
      if (clRef.current) {
        const {
          top,
          // right,
          // bottom,
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

        if (
          clDeviceSize === 'sm' ? isRightPositionedMobile : isRightPositioned
        ) {
          // console.log('entered right')
          if (clDeviceSize === 'sm') {
            posLeft = scrollableWidth - modalWidth - marginX
            arrowLeft = modalWidth + marginX - remaining - 10
          } else {
            posLeft = viewportWidth - modalWidth - marginX
            arrowLeft = modalWidth + marginX - remaining - 10
          }
        } else if (left + buttonHalfWidth < modalHalfWidth + marginX) {
          // console.log('entered left')
          posLeft = marginX
          arrowLeft = left - marginX + (buttonHalfWidth - 10)
        } else {
          // console.log('entered center')
          posLeft = left + buttonHalfWidth - modalHalfWidth
          arrowLeft = modalHalfWidth - 10
        }

        // Adjust position to avoid overflow at the bottom
        if (isTopPositioned) {
          // console.log('entered top')
          posTop = top - modalHeight - marginY - 1
          arrowTop = modalHeight - 8
          isArrowOnTop = true
        } else {
          // console.log('entered bottom')
          posTop = top + buttonHeight + marginY + 1
          arrowTop = -8
        }

        // console.log({
        //   top,
        //   right,
        //   bottom,
        //   left,
        //   buttonHeight,
        //   buttonWidth,
        //   modalHeight,
        //   viewportWidth,
        //   viewportHeight,
        //   scrollableWidth,
        //   scrollableHeight,
        //   buttonHalfWidth,
        //   modalHalfWidth,
        //   isRightPositioned,
        //   isRightPositionedMobile,
        //   remaining,
        //   isTopPositioned,
        // })

        setMenuPosition({
          posTop,
          posLeft,
          arrowLeft,
          arrowTop,
          isArrowOnTop,
        })
      }
    }
    if (clIsOpen) {
      calculatePosition()
    }

    window.addEventListener('resize', calculatePosition)
    document.addEventListener('click', handleOutsideClick)

    return () => {
      window.removeEventListener('resize', calculatePosition)
      document.removeEventListener('click', handleOutsideClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clIsOpen])

  const Menu = ({
    children,
    clArrowStyles,
    clDisableArrow,
    className,
  }: I_Menu) => {
    return (
      <div className="relative">
        {clIsOpen && (
          <div
            ref={menuRef}
            style={{
              top: `${menuPosition.posTop}px`,
              left: `${menuPosition.posLeft}px`,
            }}
            className="fixed bottom-2 right-2 w-fit h-fit shadow-md rounded-md"
          >
            <div className={'relative'}>
              {!clDisableArrow && (
                <div
                  className={twMerge(
                    `size-4 absolute rotate-45 bg-white -z-10`,
                    clArrowStyles
                  )}
                  style={{
                    borderLeft: menuPosition.isArrowOnTop ? 'none' : undefined,
                    borderTop: menuPosition.isArrowOnTop ? 'none' : undefined,
                    borderRight: !menuPosition.isArrowOnTop
                      ? 'none'
                      : undefined,
                    borderBottom: !menuPosition.isArrowOnTop
                      ? 'none'
                      : undefined,
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
        )}
      </div>
    )
  }

  return { Menu, clToggleMenu, clIsOpen, clRef }
}

export default useMenu
