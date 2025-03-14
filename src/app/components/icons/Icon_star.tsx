import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_star = forwardRef<SVGSVGElement, IIcon>(function Icon_star(
  { className, ...props },
  ref
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 21"
      fill="none"
      className={twMerge('size-5', className)}
      {...props}
      ref={ref}
    >
      <path
        d="M11.4755 1.46353L11.9511 1.30902C11.6517 0.38771 10.3483 0.387701 10.0489 1.30902L8.16708 7.10081H2.07722C1.1085 7.10081 0.705717 8.34043 1.48943 8.90983L6.41623 12.4894L4.53436 18.2812C4.23501 19.2025 5.28948 19.9686 6.0732 19.3992L11 15.8197L15.9268 19.3992C16.7105 19.9686 17.765 19.2025 17.4656 18.2812L15.5838 12.4894L20.5106 8.90983C21.2943 8.34043 20.8915 7.10081 19.9228 7.10081L13.8329 7.10081L11.9511 1.30902L11.4755 1.46353Z"
        stroke="currentColor"
      />
    </svg>
  )
})

export default Icon_star
