import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_hearts = forwardRef<SVGSVGElement, IIcon>(function Icon_hearts(
  { className, ...props },
  ref
) {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 32 25"
      className={twMerge('size-6', className)}
      {...props}
      ref={ref}
      fill="currentColor"
    >
      <defs></defs>
      <path
        className="st0"
        d="M9.33,11.06c1.17-2.12,2.33-3.18,4.67-3.18,2.58,0,4.67,1.9,4.67,4.24,0,4.24-4.67,8.48-9.33,12.73C4.67,20.61,0,16.36,0,12.12,0,9.78,2.09,7.88,4.67,7.88c2.33,0,3.5,1.06,4.67,3.18h0Z"
      />
      <path
        className="st0"
        d="M25.46,2.94c.81-1.47,1.62-2.2,3.23-2.2,1.78,0,3.23,1.32,3.23,2.94,0,2.94-3.23,5.88-6.46,8.81-3.23-2.94-6.46-5.88-6.46-8.81,0-1.62,1.45-2.94,3.23-2.94,1.62,0,2.42.73,3.23,2.2h0Z"
      />
    </svg>
  )
})

export default Icon_hearts
