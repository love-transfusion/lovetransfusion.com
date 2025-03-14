import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonRightIcon extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

const ButtonRightIcon = ({
  children,
  className,
  ...props
}: ButtonRightIcon) => {
  return (
    <div
      {...props}
      className={twMerge(
        'absolute top-0 bottom-0 -right-[22px] h-full flex items-center',
        className
      )}
    >
      {children}
    </div>
  )
}

export default ButtonRightIcon
