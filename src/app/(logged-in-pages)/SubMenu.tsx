'use client'
import React from 'react'
import utilityStore from '../utilities/store/utilityStore'
import { useStore } from 'zustand'
import dashboard from './images/dashboard-new.svg'
import profile from './images/profile.svg'
import privacy from './images/privacy.svg'
import Image from 'next/image'
import Link from 'next/link'
import Icon_cog from '../components/icons/Icon_cog'

interface I_SubMenu {
  clIsAdmin: boolean
}

const SubMenu = ({ clIsAdmin }: I_SubMenu) => {
  const { userInStore } = useStore(utilityStore)
  return (
    <div className={'mt-[49px] flex flex-col gap-[15px]'}>
      <p className={'text-[#DFEEFA8F] mb-[3px] tracking-[0.48px] font-light'}>
        MAIN MENU
      </p>
      {clIsAdmin && (
        <Link href={`/admin`}>
          <div
            className={
              'flex gap-[13px] items-center text-xl font-acumin-variable-95 font-light'
            }
          >
            <Icon_cog className="size-[36px] -ml-1" strokeWidth={0.8} />
            <p className={'ml-1 -mt-[1px]'}>Manage Recipients</p>
          </div>
        </Link>
      )}
      <Link
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
          <p className={'-mt-[1px]'}>Dashboard</p>
        </div>
      </Link>
      <Link
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
          <p className={'-mt-[1px]'}>Profile</p>
        </div>
      </Link>
      <Link href={'/privacy-policy'}>
        <div
          className={
            'flex gap-[18px] items-center text-xl font-acumin-variable-95 font-light -mt-[2px]'
          }
        >
          <Image
            src={privacy}
            alt="heart"
            quality={100}
            className="size-[34px] px-[3px] -ml-[3px]"
          />
          <p className={'-mt-[1px]'}>Privacy</p>
        </div>
      </Link>
    </div>
  )
}

export default SubMenu
