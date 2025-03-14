import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_right3 = forwardRef<SVGSVGElement, IIcon>(function Icon_right3(
  { className, ...props },
  ref
) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge('size-6', className)}
      {...props}
      ref={ref}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.1571 13.711L11.5001 19.368L10.0861 17.954L15.0361 13.004L10.0861 8.05401L11.5001 6.64001L17.1571 12.297C17.3445 12.4845 17.4498 12.7389 17.4498 13.004C17.4498 13.2692 17.3445 13.5235 17.1571 13.711Z"
        fill="currentColor"
      />
    </svg>
  )
})

export default Icon_right3
