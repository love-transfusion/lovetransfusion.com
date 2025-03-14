import React from 'react'
import { twMerge } from 'tailwind-merge'

interface I_TextArea extends React.HTMLAttributes<HTMLTextAreaElement> {
  clPlaceholder: string
  className?: string
  clVariant?: 'default' | 'textarea2'
  /**This will determine the height of the text area */
  clRows?: number
}

const getVariant = (variant: I_TextArea['clVariant']): string => {
  const variants = {
    default: `border border-neutral-400 rounded-lg focus:outline-none py-[2px] border-2 border-primary placeholder:text-primary bg-primary-50 w-full p-2`,
    textarea2: 'w-full',
  }
  return variant ? variants[variant] : variants['default']
}

const TextArea = ({
  clPlaceholder,
  className,
  clVariant,
  clRows = 3,
}: I_TextArea) => {
  const variantStyles = getVariant(clVariant)
  return (
    <textarea
      placeholder={clPlaceholder ?? 'Text here...'}
      className={twMerge('resize-none row-span-12', variantStyles, className)}
      rows={clRows}
    />
  )
}

export default TextArea
