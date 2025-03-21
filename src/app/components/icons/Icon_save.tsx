import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_save = forwardRef<SVGSVGElement, IIcon>(function Icon_save(
  { className, ...props },
  ref
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      id="save"
      className={twMerge('size-6', className)}
      {...props}
      ref={ref}
      fill="currentColor"
    >
      <g>
        <path d="M29.77,9.06,22.94,2.23a2.48,2.48,0,0,0-1.77-.73H4A2.5,2.5,0,0,0,1.5,4V28A2.5,2.5,0,0,0,4,30.5H28A2.5,2.5,0,0,0,30.5,28V10.83A2.49,2.49,0,0,0,29.77,9.06ZM7.5,2.5h11V9a.5.5,0,0,1-.5.5H8A.5.5,0,0,1,7.5,9ZM29.5,28A1.5,1.5,0,0,1,28,29.5H4A1.5,1.5,0,0,1,2.5,28V4A1.5,1.5,0,0,1,4,2.5H6.5V9A1.5,1.5,0,0,0,8,10.5H18A1.5,1.5,0,0,0,19.5,9V2.5h1.67a1.51,1.51,0,0,1,1.06.44l6.83,6.83a1.49,1.49,0,0,1,.44,1.06Z"></path>
        <rect width="3" height="4" x="14.5" y="3.5" rx=".5" ry=".5"></rect>
        <path d="M25,13.5H7A1.5,1.5,0,0,0,5.5,15V26A1.5,1.5,0,0,0,7,27.5H25A1.5,1.5,0,0,0,26.5,26V15A1.5,1.5,0,0,0,25,13.5ZM25.5,26a.5.5,0,0,1-.5.5H7a.5.5,0,0,1-.5-.5V15a.5.5,0,0,1,.5-.5H25a.5.5,0,0,1,.5.5Z"></path>
      </g>
    </svg>
  )
})

export default Icon_save
