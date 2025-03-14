'use client'

import Icon_heart from '@/app/components/icons/Icon_heart'
import React from 'react'
import Marquee from 'react-fast-marquee'

const SlidingSupportersName = () => {
  return (
    <Marquee speed={50} className='bg-[#E5F4FA] py-[8px]'>
      <div className={'flex gap-2 items-center text-primary px-6'}>
        <Icon_heart className='size-[14px]' />
        <p className="w-[200px] text-nowrap text-sm">
          Someone Who Cares - Philippines
        </p>
      </div>
      <div className={'flex gap-2 items-center text-primary px-6'}>
        <Icon_heart className='size-[14px]' />
        <p className="w-[200px] text-nowrap text-sm">
          Someone Who Cares - Philippines
        </p>
      </div>
      <div className={'flex gap-2 items-center text-primary px-6'}>
        <Icon_heart className='size-[14px]' />
        <p className="w-[200px] text-nowrap text-sm">
          Someone Who Cares - Philippines
        </p>
      </div>
      <div className={'flex gap-2 items-center text-primary px-6'}>
        <Icon_heart className='size-[14px]' />
        <p className="w-[200px] text-nowrap text-sm">
          Someone Who Cares - Philippines
        </p>
      </div>
      <div className={'flex gap-2 items-center text-primary px-6'}>
        <Icon_heart className='size-[14px]' />
        <p className="w-[200px] text-nowrap text-sm">
          Someone Who Cares - Philippines
        </p>
      </div>
      <div className={'flex gap-2 items-center text-primary px-6'}>
        <Icon_heart className='size-[14px]' />
        <p className="w-[200px] text-nowrap text-sm">
          Someone Who Cares - Philippines
        </p>
      </div>
    </Marquee>
  )
}

export default SlidingSupportersName
