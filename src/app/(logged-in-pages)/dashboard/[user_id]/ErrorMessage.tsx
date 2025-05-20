'use client'
import Icon_close from '@/app/components/icons/Icon_close'
import React, { useState } from 'react'

interface ErrorMessage {
  error: string | null | undefined
}

const ErrorMessage = ({ error }: ErrorMessage) => {
  const [isClosed, setisClosed] = useState<boolean>(false)
  return (
    <>
      {!isClosed && (
        <div
          className={
            'px-3 w-full md:px-6 lg:px-10 xl:px-5 bg-red-100 py-1 md:py-[2px] z-[999]'
          }
        >
          <div className={'relative w-full flex gap-0'}>
            <p
              className={
                'md:text-center text-sm md:text-base leading-tight md:leading-normal'
              }
            >
              {error}
            </p>
            <Icon_close
              className="block md:hidden min-w-5 min-h-5"
              onClick={() => setisClosed(true)}
            />
            <p onClick={() => setisClosed(true)}
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
