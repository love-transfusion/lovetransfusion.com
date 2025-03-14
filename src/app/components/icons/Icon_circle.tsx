import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_circle = forwardRef<SVGSVGElement, IIcon>(function Icon_circle(
  { className, ...props },
  ref
) {
  return (
    <svg
      fill="#000000"
      className={twMerge('size-4', className)}
      {...props}
      ref={ref}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle fill="currentColor" cx="16" cy="16" r="16"></circle> {/* </g> */}
    </svg>
  )
})

export default Icon_circle
