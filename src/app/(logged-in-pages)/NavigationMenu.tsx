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
      className={'hidden xl:flex flex-col bg-black justify-start items-start'}
    >
      <div className="h-full w-full">
        <div className={'bg-[#2F8EDD] h-[84px]'} />
        <div
          className={
            'bg-[linear-gradient(rgb(47,142,221)_0%,rgb(47,157,221)_33%,rgb(47,171,221)_69%,rgb(47,186,221)_97%)] px-6 xl:px-4 2xl:px-6 h-[calc(100%-24px)] text-[#DFEEFA] font-acumin-variable-90 pb-10'
          }
        >
          <div className={'text-[#E9F5FE] text-center -mt-[60px]'}>
            <Image
              src={ltLogo}
              alt="Love Transfusion Logo"
              quality={100}
              className="mx-auto"
            />
            <p
              className={
                'font-acumin-concept-90 text-2xl mt-4 text-nowrap font-medium block xl:hidden 2xl:block'
              }
            >
              LOVE TRANSFUSION
            </p>
            <p
              className={
                'font-acumin-variable-103 -mt-[2px] mb-[22px] tracking-[0.48px] font-light block xl:hidden 2xl:block'
              }
            >
              Support Platform
            </p>
            <p
              className={
                'font-acumin-variable-92 border-y text-[#E9F5FE] border-[#92CCED] pt-[2px] pb-[3.5px] tracking-[0.48px] text-lg font-light block xl:hidden 2xl:block'
              }
            >
              {getFormattedDate()}
            </p>
          </div>
          <SubMenu clIsAdmin={clIsAdmin} />
          <SubMenuBottom clIsAdmin={clIsAdmin} />
        </div>
      </div>
    </div>
  )
}

export default NavigationMenu
