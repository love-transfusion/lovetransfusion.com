'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LazyMotion, m } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
import Icon_right from './icons/Icon_right'
import useDeviceSize from '../hooks/useDeviceSize'
const loadFeatures = () =>
  import('@/app/utilities/framerMotion/features').then((res) => res.default)

interface I_clWidth {
  sm?: `${number}px` | `${number}%` | `${number}vw`
  xl?: `${number}px` | `${number}%` | `${number}vw`
  bigScreens?: `${number}px` | `${number}%` | `${number}vw`
}

interface I_Drawer extends I_clWidth {
  className?: string
  clBackgroundStyle?: string
  children: React.ReactNode
  componentCloseIcon?: React.ReactNode
  clShowCloseIcon?: boolean
  clIsOpen: boolean
  clStyle?: React.CSSProperties
  clWidth?: I_clWidth
  clContainerStyle?: string
  clMoveLeftToRight?: boolean
  clToggleDrawer: () => void
}

const Drawer = ({
  className,
  clBackgroundStyle,
  children,
  clShowCloseIcon,
  clMoveLeftToRight,
  clIsOpen,
  clStyle,
  clWidth,
  clContainerStyle,
  componentCloseIcon,
  clToggleDrawer,
}: I_Drawer) => {
  const handleCloseDrawer = () => {
    clToggleDrawer()
  }
  const containerRef = useRef<HTMLDivElement>(null)
  const [minWidth, setminWidth] = useState<
    `${number}px` | `${number}%` | `${number}vw`
  >('80%')
  const { clDeviceSize } = useDeviceSize()

  const animate = {
    initial: {
      x: clMoveLeftToRight ? '-100vw' : '100vw',
      transition: {
        duration: 0.2,
      },
    },
    animate: {
      x: '0vw',
      transition: {
        duration: 0.2,
      },
    },
    initialOpacity: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    animateOpacity: {
      opacity: 100,
      transition: {
        duration: 1,
      },
    },
  }

  useEffect(() => {
    if (clDeviceSize === 'sm' && clWidth?.sm) {
      setminWidth(clWidth.sm)
    } else if (clDeviceSize === 'xl' && clWidth?.xl) {
      setminWidth(clWidth.xl)
    } else if (clWidth?.bigScreens) {
      setminWidth(clWidth.bigScreens)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clDeviceSize])
  return (
    <LazyMotion features={loadFeatures}>
      <AnimatePresence>
        {clIsOpen && (
          <div
            className={`fixed top-0 left-0 w-full h-screen bg-secondary-950 bg-opacity-70 z-[999] flex ${
              clMoveLeftToRight && 'flex-row-reverse'
            }`}
            ref={containerRef}
          >
            <div
              className={twMerge('flex w-full z-10', clBackgroundStyle)}
              onClick={handleCloseDrawer}
            />
            <div
              className={
                'fixed w-full h-full backdrop-blur-[2px] bg-black opacity-50'
              }
            />
            <m.div
              variants={animate}
              initial="initial"
              animate="animate"
              exit="initial"
              className={twMerge(
                'flex h-full shadow-md bg-white relative z-[999] overflow-y-auto',
                clContainerStyle
              )}
              style={{ minWidth, ...clStyle }}
            >
              {clShowCloseIcon && (
                <m.div
                  variants={animate}
                  initial="initialOpacity"
                  animate="animateOpacity"
                  exit="initialOpacity"
                  onClick={handleCloseDrawer}
                  className={
                    'absolute top-3 right-3 flex items-center border border-primary cursor-pointer'
                  }
                >
                  {componentCloseIcon ?? (
                    <Icon_right className="size-6 text-primary" />
                  )}
                </m.div>
              )}
              <div className={twMerge('w-full h-full text-black', className)}>
                <div className={'h-5'} />{' '}
                {/* This will serve as default top padding */}
                {children}
                <div className={'h-5'} />{' '}
                {/* This will serve as default bottom padding */}
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}

export default Drawer
