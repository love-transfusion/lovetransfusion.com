import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface I_Input extends React.InputHTMLAttributes<HTMLInputElement> {
  clLeftIcon?: React.ReactNode
  clRightIcon?: React.ReactNode
  clPlaceholder: string
  className?: string
  clIconClassName?: string
  clContainerClassName?: string
  clVariant?: 'default' | 'input2'
  // type?: string
  clErrorMessage?: string | undefined
  clValue?: string
}

const getVariant = (
  variant: I_Input['clVariant'],
  leftIcon: I_Input['clLeftIcon'],
  rightIcon: I_Input['clRightIcon']
): string => {
  const variants = {
    default: `border border-neutral-400 rounded-lg focus:outline-none py-[2px] border-2 border-primary placeholder:text-primary bg-primary-50 w-full p-2 ${
      leftIcon && 'pl-7'
    } ${rightIcon && 'pr-7'}`,
    input2: `border border-transparent rounded-md shadow-sm p-3 focus:outline-none w-full ${
      leftIcon && 'pl-7'
    } ${rightIcon && 'pr-7'}`,
  }
  return variant ? variants[variant] : variants['default']
}

const Input = forwardRef<HTMLInputElement, I_Input>(function Input(
  {
    clPlaceholder = 'Text here...',
    clContainerClassName,
    clIconClassName,
    clErrorMessage,
    clRightIcon,
    clLeftIcon,
    className,
    clVariant,
    clValue,
    ...props
  }: I_Input,
  ref
) {
  const variantStyles = getVariant(clVariant, clLeftIcon, clRightIcon)
  return (
    <div className={twMerge('relative', clContainerClassName)}>
      {clLeftIcon && (
        <div
          className={twMerge(
            'absolute top-0 bottom-0 my-auto left-[6px] z-20 h-fit text-primary',
            clIconClassName
          )}
        >
          {clLeftIcon}
        </div>
      )}
      {clRightIcon && (
        <div
          className={twMerge(
            'absolute top-0 bottom-0 my-auto right-[6px] z-20 h-fit text-primary',
            clIconClassName
          )}
        >
          {clRightIcon}
        </div>
      )}
      <input
        ref={ref}
        {...props}
        value={clValue}
        placeholder={clPlaceholder}
        className={twMerge(``, variantStyles, className)}
      />
      {clErrorMessage && (
        <p className={'text-sm text-red-500'}>{clErrorMessage}</p>
      )}
    </div>
  )
})

export default Input
