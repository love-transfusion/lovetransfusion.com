import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_ellipsis_horizontal = forwardRef<SVGSVGElement, IIcon>(
  function Icon_ellipsis_horizontal({ className, ...props }, ref) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={twMerge('size-5', className)}
        {...props}
        ref={ref}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
    )
  }
)

export default Icon_ellipsis_horizontal
