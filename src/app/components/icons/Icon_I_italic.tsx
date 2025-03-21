import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_I_italic = forwardRef<SVGSVGElement, IIcon>(function Icon_I_italic(
  { className, ...props },
  ref
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      className={twMerge('size-5', className)}
      {...props}
      ref={ref}
    >
      <path
        fill="currentColor"
        d="M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0L160 416l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0L224 96l-64 0c-17.7 0-32-14.3-32-32z"
      />
    </svg>
  )
})

export default Icon_I_italic
