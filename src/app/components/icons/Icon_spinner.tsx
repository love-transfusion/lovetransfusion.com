import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_spinner = forwardRef<SVGSVGElement, IIcon>(function Icon_spinner(
  { className, ...props },
  ref
) {
  return (
    <svg
      fill="#000000"
      viewBox="-1.5 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge('size-6', className)}
      {...props}
      ref={ref}
    >
      <path
        fill="currentColor"
        d="m7.5 21 2.999-3v1.5c4.143 0 7.501-3.359 7.501-7.502 0-2.074-.842-3.952-2.202-5.309l2.114-2.124c1.908 1.901 3.088 4.531 3.088 7.437 0 5.798-4.7 10.498-10.498 10.498-.001 0-.001 0-.002 0v1.5zm-7.5-9c.007-5.796 4.704-10.493 10.499-10.5h.001v-1.5l3 3-3 3v-1.5s-.001 0-.002 0c-4.143 0-7.502 3.359-7.502 7.502 0 2.074.842 3.952 2.203 5.31l-2.112 2.124c-1.907-1.89-3.088-4.511-3.088-7.407 0-.01 0-.02 0-.03v.002z"
      ></path>
      {/* </g> */}
    </svg>
  )
})

export default Icon_spinner
