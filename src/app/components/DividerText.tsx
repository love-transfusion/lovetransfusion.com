import React from 'react'
import { twMerge } from 'tailwind-merge'

interface I_DividerText {
  children: React.ReactNode
  clBorderTopClassName?: string
}

const DividerText = ({ children, clBorderTopClassName }: I_DividerText) => {
  return (
    <div className="w-full">
      <div className={'flex items-center gap-3 md:gap-5 mx-auto'}>
        <div
          className={twMerge(
            'flex border-t w-full h-[1px] mt-[2px]',
            clBorderTopClassName
          )}
        />

        {children}
        <div
          className={twMerge(
            'flex border-t w-full h-[1px] mt-[2px]',
            clBorderTopClassName
          )}
        />
      </div>
    </div>
  )
}

export default DividerText
