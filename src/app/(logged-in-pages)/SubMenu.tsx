'use client'
import React from 'react'
import utilityStore from '../utilities/store/utilityStore'
import { useStore } from 'zustand'
import dashboard from './images/dashboard-new.svg'
import profile from './images/profile.svg'
import privacy from './images/privacy.svg'
import Image from 'next/image'
import Icon_cog from '../components/icons/Icon_cog'
import LinkCustom from '../components/Link/LinkCustom'

interface I_SubMenu {
  clIsAdmin: boolean
}

const SubMenu = ({ clIsAdmin }: I_SubMenu) => {
  const { userInStore } = useStore(utilityStore)
  return (
    <div
      className={
        'mt-[49px] xl:mt-8 2xl:mt-[49px] flex flex-col items-start xl:items-center 2xl:items-start gap-[15px]'
      }
    >
      <p
        className={
          'text-[#DFEEFA8F] mb-[3px] tracking-[0.48px] font-light text-left xl:text-center 2xl:text-left'
        }
      >
        MAIN MENU
      </p>
      {clIsAdmin && (
        <LinkCustom href={`/admin`}>
          <div
            className={
              'flex gap-[13px] items-center text-xl font-acumin-variable-95 font-light'
            }
          >
            <Icon_cog className="size-[36px] 2xl:-ml-1" strokeWidth={0.8} />
            <p className={'ml-1 -mt-[1px] block xl:hidden 2xl:block'}>
              Manage Recipients
            </p>
          </div>
        </LinkCustom>
      )}
      <LinkCustom
        className={`${!userInStore?.id && 'pointer-events-none'}`}
        href={`/dashboard/${userInStore?.id}`}
        scroll={true}
      >
        <div
          className={
            'flex gap-5 items-center text-xl font-acumin-variable-95 font-light'
          }
        >
          <Image
            src={dashboard}
            alt="heart"
            quality={100}
            className="size-[28px]"
          />
          <p className={'-mt-[1px] block xl:hidden 2xl:block'}>Dashboard</p>
        </div>
      </LinkCustom>
      <LinkCustom
        className={`${!userInStore?.id && 'pointer-events-none'}`}
        href={`/profile/${userInStore?.id}`}
      >
        <div
          className={
            'flex gap-5 items-center text-xl font-acumin-variable-95 font-light'
          }
        >
          <Image
            src={profile}
            alt="heart"
            quality={100}
            className="size-[28px]"
          />
          <p className={'-mt-[1px] block xl:hidden 2xl:block'}>Profile</p>
        </div>
      </LinkCustom>
      <LinkCustom href={'/privacy-policy'}>
        <div
          className={
            'flex gap-[18px] items-center justify-center text-xl font-acumin-variable-95 font-light -mt-[2px]'
          }
        >
          <Image
            src={privacy}
            alt="heart"
            quality={100}
            className="size-[34px] px-[3px] -ml-[3px]"
          />
          <p className={'-mt-[1px] block xl:hidden 2xl:block'}>Privacy</p>
        </div>
      </LinkCustom>
    </div>
  )
}

export default SubMenu
