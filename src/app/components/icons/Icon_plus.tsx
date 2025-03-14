import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_plus = forwardRef<SVGSVGElement, IIcon>(function Icon_plus({ className, ...props }, ref) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={twMerge('size-5', className)}
      {...props}
      ref={ref}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  )
})

export default Icon_plus
