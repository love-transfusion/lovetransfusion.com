import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_house = forwardRef<SVGSVGElement, IIcon>(function Icon_house(
  { className, ...props },
  ref
) {
  return (
    <svg
      // viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge('size-6', className)}
      {...props}
      ref={ref}
    >
      <g clipPath="url(#clip0_1185_1858)">
        <path d="M0 10.0487L12.4962 3L25 10.0487H0Z" fill="currentColor" />
        <path
          d="M2.56665 9.18298V22.9203H9.21697V16.1321H15.7754V22.9203H22.4333V9.18298H2.56665Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1185_1858">
          <rect
            width="25"
            height="19.9203"
            fill="currentColor"
            transform="translate(0 3)"
          />
        </clipPath>
      </defs>
    </svg>
  )
})

export default Icon_house
