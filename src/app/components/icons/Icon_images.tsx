import { IIcon } from '@/types/IIcon'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Icon_images = forwardRef<SVGSVGElement, IIcon>(function Icon_images(
  { className, ...props },
  ref
) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={twMerge('size-5', className)}
      {...props}
      ref={ref}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M19 7h4v15H6v-4h1v3h15V8h-3zM1 17V2h17v15zm1-5.033l1.683-1.683a.409.409 0 0 1 .576-.002.4.4 0 0 0 .57.012L7.753 7.37a.408.408 0 0 1 .55-.025l2.932 2.443a.408.408 0 0 0 .507.013l1.769-1.327a.409.409 0 0 1 .534.038L17 11.467V3H2zM17 16v-3.119l-3.3-3.3-1.358 1.019a1.407 1.407 0 0 1-1.747-.044L8.078 8.459 5.536 11a1.376 1.376 0 0 1-.98.406 1.397 1.397 0 0 1-.492-.09L2 13.381V16zm-5.5-9.5a1 1 0 1 0-1-1 1 1 0 0 0 1 1z"></path>
        <path fill="none" d="M0 0h24v24H0z"></path>
      </g>
    </svg>
  )
})

export default Icon_images
