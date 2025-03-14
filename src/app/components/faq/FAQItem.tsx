'use client'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Icon_plus from '../icons/Icon_plus'
import Icon_negative from '../icons/Icon_negative'

interface I_FaqInterface {
  clTitle: string
  /** This must be a component */
  clContent: React.ReactNode
  clContainerClassName?: string
  clIconContainerClassName?: string
  clIconClassName?: string
  clTitleClassName?: string
}

const FAQItem = ({
  clContainerClassName,
  clContent,
  clTitle,
  clIconContainerClassName,
  clIconClassName,
  clTitleClassName,
}: I_FaqInterface) => {
  const [isOpen, setisOpen] = useState<boolean | null>(null)
  const handleClick = () => {
    setisOpen((prev) => !prev)
  }
  return (
    <div
      className={twMerge(
        `border-2 border-primary-200 rounded-lg px-4 ${
          isOpen ? 'pb-4' : 'pb-0'
        }`,
        clContainerClassName
      )}
    >
      <div
        className={
          'flex justify-between items-center select-none cursor-pointer gap-[6px]'
        }
        onClick={handleClick}
      >
        <p className={twMerge('py-4 text-primary text-xl', clTitleClassName)}>
          {clTitle ?? 'Title here...'}
        </p>
        <div
          className={twMerge(
            'border-2 border-primary rounded-full p-[1px] box-border h-fit',
            clIconContainerClassName
          )}
        >
          {!isOpen && (
            <Icon_plus
              className={twMerge('text-primary size-3', clIconClassName)}
            />
          )}
          {isOpen && <Icon_negative className="text-primary size-3" />}
        </div>
      </div>
      {isOpen && (
        <>
          {clContent ?? (
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              dolor neque, ullamcorper quis nunc et, tincidunt bibendum nulla.
              In vehicula purus non elit molestie rutrum.
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default FAQItem
