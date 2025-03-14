import { IIcon } from '@/types/IIcon'
import React from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_heart = ({ className }: IIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      id="love"
      className={twMerge('size-5', className)}
    >
      <path
        fill="currentColor"
        d="M32,57,56.36,32.1h0A14.5,14.5,0,0,0,46.42,7c-7.47,0-13.61,5.13-14.35,7.31a.08.08,0,0,1-.15,0C31.19,12.11,25.05,7,17.58,7A14.5,14.5,0,0,0,7.64,32.1h0L32,57"
      ></path>
    </svg>
  )
}

export default Icon_heart
