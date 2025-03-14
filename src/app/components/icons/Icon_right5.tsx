import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_right5 = forwardRef<SVGSVGElement, IIcon>(function Icon_right5(
  { className, ...props },
  ref
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10.89 9.86"
      className={twMerge('size-6', className)}
      {...props}
      ref={ref}
    >
      <g clipPath="url(#clip0_3020_276)">
        <path
          d="M0.570225 9.93C0.450225 9.93 0.330225 9.88 0.240225 9.79C0.0602246 9.61 0.0602246 9.32 0.240225 9.14L4.38022 5L0.250225 0.859997C0.0702246 0.679997 0.0602246 0.389997 0.250225 0.209997C0.430225 0.0199973 0.720225 0.0199973 0.900225 0.209997L5.37022 4.68C5.46023 4.77 5.50022 4.88 5.50022 5.01C5.50022 5.14 5.45022 5.25 5.37022 5.34L0.900225 9.79C0.810225 9.88 0.690225 9.93 0.570225 9.93Z"
          fill="currentColor"
        />
        <path
          d="M6.07022 9.93C5.95022 9.93 5.83022 9.88 5.74022 9.79C5.56022 9.61 5.56022 9.32 5.74022 9.14L9.88023 5L5.74022 0.859997C5.56022 0.679997 5.56022 0.389997 5.74022 0.209997C5.92022 0.0299969 6.21022 0.0299969 6.40022 0.209997L10.8702 4.68C11.0502 4.86 11.0502 5.15 10.8702 5.33L6.40022 9.8C6.31022 9.89 6.19022 9.94 6.07022 9.94V9.93Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_3020_276">
          <rect
            width="100%"
            height="100%"
            fill="currentColor"
            transform="translate(0.110107 0.0699997)"
          />
        </clipPath>
      </defs>
    </svg>
  )
})

export default Icon_right5
