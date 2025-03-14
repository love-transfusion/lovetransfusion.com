import React from 'react'
import NavigationMenu from './NavigationMenu'
import PublicFooter from '../components/this-website-only/footer/PublicFooter'
import dots from './images/Dots.svg'
import doubleHeart from './images/Double Heart.svg'
import Image from 'next/image'

interface I_MembersLayout {
  children: React.ReactNode
}

const MembersLayout = ({ children }: I_MembersLayout) => {
  return (
    <>
      <div className={'grid grid-cols-[273px_calc(100%-273px)]'}>
        <NavigationMenu />
        <div className="h-full flex flex-col w-full">
          <div
            className={
              'bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-[#DFEEFA8F] h-[84px] pl-7 pr-11 flex items-center justify-between'
            }
          >
            <div className={'flex gap-[98px] items-center'}>
              <p className={'text-2xl tracking-[3px]'}>DASHBOARD</p>
              <Image src={dots} alt="dots" quality={100} />
              <div className={'flex gap-[15px]'}>
                <Image src={doubleHeart} alt="dots" quality={100} />
                <p className={'text-[26px] italic'}>
                  Love Transfusion In Progress
                </p>
                <Image src={doubleHeart} alt="dots" quality={100} />
              </div>
            </div>
            <p className={'text-xl text-[#ffffffad] flex gap-[10px]'}>
              RECIPIENT:
              <span className="font-acuminProMedium tracking-[0.5px]">
                Adley
              </span>
            </p>
          </div>
          <div className={'border-4 border-r-0 border-[#B0E0F1] h-full'}>
            {children}
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  )
}

export default MembersLayout
