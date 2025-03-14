import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonLeftIcon extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

const ButtonLeftIcon = ({ children, className, ...props }: ButtonLeftIcon) => {
  return (
    <div
      {...props}
      className={twMerge(
        'absolute top-0 bottom-0 -left-[22px] h-full flex items-center',
        className
      )}
    >
      {children}
    </div>
  )
}

export default ButtonLeftIcon
