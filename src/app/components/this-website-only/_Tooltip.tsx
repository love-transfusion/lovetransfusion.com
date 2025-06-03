/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Button from '@/app/components/Button/Button'
import useMenu2 from '@/app/hooks/useMenu2'
import React, { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

interface TooltipTypes {
  clContainerClassName?: string
  clNextButtonFunction: () => void
}

const Tooltip = ({
  clContainerClassName,
  clNextButtonFunction,
}: TooltipTypes) => {
  console.log('rendered Tooltip')
  const { ClMenuContainer, clToggleMenu, Menu } = useMenu2(true)

  const handleNext = () => {
    clNextButtonFunction()
  }

  useEffect(() => {
    console.log('triggering clToggleMenu')
    clToggleMenu(true)
  }, [])
  return (
    <div className={twMerge('', clContainerClassName)}>
      <ClMenuContainer className='animate-slide-up'>
        <Menu
          className="p-0 border border-primary overflow-hidden"
          clArrowStyles="border border-primary bg-primary"
        >
          <div className={'w-[320px] bg-primary'}>
            <div className={'min-h-[150px] bg-white p-3'}>
              <p className={'font-bold text-xl text-primary'}>Awareness</p>
              <p className={'mt-2'}>
                Dots show you where your story is being seen and people are
                thinking about you.
              </p>
            </div>
            <div
              className={'min-h-[60px] px-4 flex items-center justify-between'}
            >
              <Button>Skip All</Button>
              <Button clTheme="light" onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
        </Menu>
      </ClMenuContainer>
    </div>
  )
}

export default Tooltip
