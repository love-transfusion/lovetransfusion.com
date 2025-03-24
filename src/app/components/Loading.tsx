import React from 'react'
import LTlogo from '@/app/(logged-in-pages)/images/Logo Icon.svg'
import Image from 'next/image'

const LoadingComponent = () => {
  return (
    <div className={'relative w-fit'}>
      <div className={'overflow-hidden rounded-full w-fit h-fit'}>
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
          className="absolute inset-[6px] bg-white rounded-full"
        />
      </div>
      <p className={'text-center'}>Loading...</p>
    </div>
  )
}

export default LoadingComponent
