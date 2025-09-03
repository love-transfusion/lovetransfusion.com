'use client'
import Icon_close from '@/app/components/icons/Icon_close'
import utilityStore from '@/app/utilities/store/utilityStore'
import React from 'react'
import { useStore } from 'zustand'

const ErrorMessage = () => {
  const { fbError, setfbError } = useStore(utilityStore)
  const safeError = fbError?.includes('access_token=')
    ? 'Invalid Ad ID or token.'
    : fbError
  return (
    <>
      {fbError && (
        <div
          className={
            'px-3 w-full md:px-6 lg:px-10 xl:px-5 bg-red-100 py-1 md:py-[2px] z-[999]'
          }
        >
          <div className={'relative w-full flex gap-0'}>
            <p
              className={
                'md:text-left text-sm md:text-base leading-tight md:leading-normal text-nowrap overflow-hidden pr-1'
              }
            >
              Facebook Integration Error: <em>{safeError}</em>
            </p>
            <Icon_close
              className="block md:hidden min-w-5 min-h-5"
              onClick={() => setfbError(null)}
            />
            <p
              onClick={() => setfbError(null)}
              className={
                'hidden md:flex bg-red-50 border border-red-300 items-center bg-opacity-90 rounded-md px-2 py-[1px] md:absolute md:inset-y-0 md:right-5 cursor-pointer'
              }
            >
              Close
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default ErrorMessage
