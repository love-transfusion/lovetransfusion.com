'use client'
import Toggle from '@/app/components/Toggle'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface I_ShowOrHide {
  clContainerClassName?: string
  clToggle: () => void
  clisToggled: boolean
}

const ShowOrHide = ({
  clContainerClassName,
  clisToggled,
  clToggle,
}: I_ShowOrHide) => {
  return (
    <div
      className={twMerge(
        'flex text-primary items-center text-lg gap-[17px] justify-center xl:min-w-[260px] 2xl:min-w-[330px]',
        clContainerClassName
      )}
    >
      <p className={'text-sm md:text-lg'}>Show</p>
      <Toggle clToggle={clToggle} clIsToggled={clisToggled} />
      <p className={'text-sm md:text-lg'}>Hide</p>
    </div>
  )
}

export default ShowOrHide
