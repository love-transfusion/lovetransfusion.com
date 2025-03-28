import Icon_heart from '@/app/components/icons/Icon_heart'
import React from 'react'
import Marquee from 'react-fast-marquee'

const SlidingSupportersName = () => {
  return (
    <div className={'flex items-center min-h-9 bg-[#E5F4FA]'}>
      <Marquee speed={50}>
        <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div>
        <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div>
        <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div>
        <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div>
        <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div>
        <div className={'flex gap-2 items-center text-primary px-6'}>
          <Icon_heart className="size-[14px]" />
          <p className="w-[200px] text-nowrap text-sm">
            Someone Who Cares - Philippines
          </p>
        </div>
      </Marquee>
    </div>
  )
}

export default SlidingSupportersName
