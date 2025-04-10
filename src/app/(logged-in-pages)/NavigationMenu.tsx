import React from 'react'
import Image from 'next/image'
import ltLogo from './images/Logo Icon.svg'
import SubMenu from './SubMenu'
import SubMenuBottom from './SubMenuBottom'

interface I_NavigationMenu {
  clIsAdmin: boolean
}

export const getFormattedDate = (): string => {
  const today: Date = new Date()
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return today.toLocaleDateString('en-US', options)
}

const NavigationMenu = ({ clIsAdmin }: I_NavigationMenu) => {
  return (
    <div
      className={'hidden 2xl:flex flex-col bg-black justify-start items-start'}
    >
      <div className="h-full w-full">
        <div className={'bg-[#2F8EDD] h-[84px]'} />
        <div
          className={
            'bg-[linear-gradient(rgb(47,142,221)_0%,rgb(47,157,221)_33%,rgb(47,171,221)_69%,rgb(47,186,221)_97%)] px-5 h-[calc(100%-20px)] text-[#DFEEFA] font-acumin-semi-condensed pb-10'
          }
        >
          <div className={'text-[#E9F5FE] text-center -mt-[64px]'}>
            <Image
              src={ltLogo}
              alt="Love Transfusion Logo"
              quality={100}
              className="mx-auto"
            />
            <p className={'text-2xl mt-[14px] text-nowrap'}>LOVE TRANSFUSION</p>
            <p className={'mt-[2px] mb-[19px]'}>Support Platform</p>
            <p className={'border-y border-[#92CCED] py-1 text-lg'}>
              {/* March 13, 2025 */}
              {getFormattedDate()}
            </p>
          </div>
          <SubMenu clIsAdmin={clIsAdmin} />
          <SubMenuBottom />
        </div>
      </div>
    </div>
  )
}

export default NavigationMenu
