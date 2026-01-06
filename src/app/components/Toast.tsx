/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect } from 'react'
import Icon_close from './icons/Icon_close'
import { twMerge } from 'tailwind-merge'
import { useStore } from 'zustand'
import { AnimatePresence, LazyMotion, m } from 'framer-motion'
import { useRouter } from 'next/navigation'
import utilityStore from '@/app/utilities/store/utilityStore'
const loadFeatures = () =>
  import('@/app/utilities/framerMotion/features').then((res) => res.default)

// settoast({
//   status: 'success',
//   description: 'Hello this is the description',
//   duration: 4000,  // optional
// })

// {toast && <Toast />}

interface I_CloseStyle {
  clCloseStyle?: string
}

const statusVariants = {
  success: `bg-green-100 border-green-500 text-green-800`,
  error: `bg-red-100 border-red-500 text-red-800`,
  information: `bg-blue-100 border-red-500 text-blue-800`,
}

const Toast = ({ clCloseStyle }: I_CloseStyle) => {
  const router = useRouter()
  const { toast, settoast } = useStore(utilityStore)
  const handleCloseToast = () => {
    settoast(null)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleCloseToast()
      if (toast?.clRedirect) {
        router.push(toast.clRedirect)
      }
    }, toast?.clDuration ?? 3000)

    return () => clearTimeout(timeout)
  }, [toast])

  const activeStatus = toast?.clStatus
    ? statusVariants[toast.clStatus]
    : statusVariants['success']

  const container = {
    hidden: {
      opacity: 1,
      x: '100%',
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      x: '0%',
      transition: {
        duration: 0.3,
      },
    },
  }
  return (
    <>
      <LazyMotion features={loadFeatures}>
        <AnimatePresence>
          {toast && (
            <m.div
              variants={container}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={twMerge(
                `fixed z-[9999] top-6 right-6 rounded-lg border shadow-md`,
                activeStatus
              )}
            >
              <div
                className={`relative flex flex-col justify-center min-w-[270px] max-w-[270px] sm:min-w-[300px] sm:max-w-[300px] min-h-14 text-[15px] py-2 px-4`}
              >
                {toast.clTitle && (
                  <p className={'font-bold'}>{toast.clTitle}</p>
                )}
                {toast.clDescription && (
                  <p className={''}>{toast.clDescription}</p>
                )}
                {!toast.clRedirect && (
                  <div
                    onClick={handleCloseToast}
                    className={twMerge(
                      'absolute top-1 right-1 bg-neutral-50 rounded-full p-[2px] cursor-pointer',
                      clCloseStyle
                    )}
                  >
                    <Icon_close className="size-5" />
                  </div>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </>
  )
}

export default Toast
