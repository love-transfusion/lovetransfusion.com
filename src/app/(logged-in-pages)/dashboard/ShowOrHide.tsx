'use client'
import Toggle from '@/app/components/Toggle'
import useToggle from '@/app/hooks/useToggle'
import React from 'react'

const ShowOrHide = () => {
  const { clisToggled, clToggle } = useToggle()
  return (
    <div className="flex text-primary items-center text-lg gap-[17px] justify-center">
      <p className={''}>Show</p>
      <Toggle clToggle={clToggle} clIsToggled={clisToggled} />
      <p className={''}>Hide</p>
    </div>
  )
}

export default ShowOrHide
