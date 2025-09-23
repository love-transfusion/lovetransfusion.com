import React from 'react'
import LTlogo from '@/app/(logged-in-pages)/images/Logo Icon.svg'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

interface I_LoadingComponent {
  clContainerClassName?: string
  clLoadingText?: string
}

const LoadingComponent = ({
  clContainerClassName,
  clLoadingText,
}: I_LoadingComponent) => {
  return (
    <div
      className={twMerge(
        'w-full h-full flex items-center justify-center bg-red-100 bg-opacity-15',
        clContainerClassName
      )}
    >
      <div className={'relative w-fit'}>
        <div className={'overflow-hidden rounded-full w-fit h-fit mx-auto'}>
          <div className="rounded-full p-[6px] bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] size-20 relative animate-spin">
            <div
              className={
                'absolute w-[50%] h-10 -top-5 inset-x-0 mx-auto bg-white'
              }
            />
          </div>
          <Image
            src={LTlogo}
            alt="Component"
            className="absolute inset-[6px] mx-auto bg-white rounded-full"
          />
        </div>
        <p className={'text-center'}>{clLoadingText ?? 'Loading...'}</p>
      </div>
    </div>
  )
}

export default LoadingComponent
