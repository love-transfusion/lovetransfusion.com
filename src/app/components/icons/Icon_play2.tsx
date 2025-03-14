import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_play2 = forwardRef<SVGSVGElement, IIcon>(function Icon_play2(
  { className, ...props },
  ref
) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge('size-4', className)}
      {...props}
      ref={ref}
    >
      <g id="Play">
        <g id="Group">
          <g id="Group_2">
            <g id="Group_3">
              <path
                id="Vector"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M35.2696 17.9247L19.0153 8.03558C16.2926 6.37514 12.9066 8.47114 12.9066 11.8042V31.5904C12.9066 34.9275 16.2926 37.0153 19.0112 35.363L35.2696 25.4739C38.0085 23.8053 38.0085 19.5933 35.2696 17.9247Z"
                fill="currentColor"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
})

export default Icon_play2
