'use client'
import Toggle from '@/app/components/Toggle'
import useToggle from '@/app/hooks/useToggle'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface I_ShowOrHide {
  clContainerClassName?: string
}

const ShowOrHide = ({ clContainerClassName }: I_ShowOrHide) => {
  const { clisToggled, clToggle } = useToggle()
  console.log('clisToggled', clisToggled)
  return (
    <div
      className={twMerge(
        'flex text-primary items-center text-lg gap-[17px] justify-center',
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
