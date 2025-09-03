'use client'

import { AnimatePresence, LazyMotion, m } from 'framer-motion'

import loadFeatures from '@/app/utilities/framerMotion/features'

type LoadingBarProps = {
  show?: boolean
  heightClassName?: string // e.g., "h-1" | "h-[2px]"
  bgClassName?: string // container background
  barClassName?: string // moving bar color
  zIndexClassName?: string // e.g., "z-[9999]"
}

export default function LoadingBar({
  show = true,
  heightClassName = 'h-[4px]',
  bgClassName = 'bg-green-50',
  barClassName = 'bg-green-400',
  zIndexClassName = 'z-[9999]',
}: LoadingBarProps) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <AnimatePresence>
        {show && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed top-0 inset-x-0 ${bgClassName} ${zIndexClassName} ${heightClassName} overflow-hidden`}
          >
            <m.div
              className={`h-full ${barClassName}`}
              style={{ width: '40%' }}
              initial={{ x: '-50%' }}
              animate={{ x: ['-100%', '250%'] }}
              transition={{
                duration: 1.3,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
