import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  clDisabled?: boolean
  clType?: 'button' | 'submit'
  clVariant?: 'normal' | 'outlined'
  clSize?: 'sm' | 'md' | 'lg' | 'xl'
  clTheme?: 'light' | 'dark'
}

const getSize = (size: ButtonProps['clSize']) => {
  const sizes = {
    sm: 'px-6 py-2',
    md: 'text-lg px-9 py-3',
    lg: 'text-xl px-12 py-4',
    xl: 'text-2xl px-[60px] py-5',
  }
  if (!size) {
    return sizes['sm']
  } else {
    return sizes[size]
  }
}

const getTheme = (properties: Pick<ButtonProps, 'clTheme' | 'clVariant'>) => {
  const { clTheme, clVariant } = properties
  const themes = {
    light: `bg-white hover:bg-primary hover:text-white border-[1px] ${
      clVariant === 'outlined'
        ? 'border-primary hover:border-primary-500'
        : 'border-white'
    }`,
    dark: `border-[1px] bg-primary text-white hover:bg-primary-500 hover:border-primary-500 ${
      clVariant === 'outlined'
        ? 'border-white hover:border-white'
        : 'border-primary'
    }`,
  }
  if (!clTheme) {
    return themes['dark']
  } else {
    return themes[clTheme]
  }
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    clDisabled,
    clType,
    clTheme,
    clVariant,
    clSize,
    ...props
  }: ButtonProps,
  ref
) {
  const cssSize = getSize(clSize)
  const cssTheme = getTheme({ clTheme, clVariant })
  return (
    <button
      ref={ref}
      type={clType}
      {...props}
      disabled={clDisabled}
      className={twMerge(
        `group block bg-[#38AADF] text transition-all duration-200`,
        cssSize,
        cssTheme,
        className
      )}
    >
      <div className={twMerge(`relative w-full`)}>{children}</div>
    </button>
  )
})

export default Button
