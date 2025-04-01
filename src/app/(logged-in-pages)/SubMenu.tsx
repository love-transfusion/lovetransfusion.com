'use client'
import React from 'react'
import utilityStore from '../utilities/store/utilityStore'
import { useStore } from 'zustand'
import dashboard from './images/dashboard-icon.svg'
import profile from './images/profile.svg'
import privacy from './images/privacy.svg'
import Image from 'next/image'
import Link from 'next/link'

const SubMenu = () => {
  const { userInStore } = useStore(utilityStore)
  return (
    <div className={'mt-[60px] flex flex-col gap-[5px]'}>
      <p className={'text-[#DFEEFA8F] mb-[13px]'}>MAIN MENU</p>
      <Link href={`/dashboard/${userInStore?.id}`}>
        <div
          className={'flex gap-[7px] items-center text-xl font-acumin-semi-condensed'}
        >
          <Image
            src={dashboard}
            alt="heart"
            quality={100}
            className="size-[43px]"
          />
          <p className={''}>Dashboard</p>
        </div>
      </Link>
      <Link href={'/#'}>
        <div
          className={'flex gap-[7px] items-center text-xl font-acumin-semi-condensed'}
        >
          <Image
            src={profile}
            alt="heart"
            quality={100}
            className="size-[43px]"
          />
          <p className={''}>Profile</p>
        </div>
      </Link>
      <Link href={'/privacy-policy'}>
        <div
          className={'flex gap-[7px] items-center text-xl font-acumin-semi-condensed'}
        >
          <Image
            src={privacy}
            alt="heart"
            quality={100}
            className="size-[43px]"
          />
          <p className={''}>Privacy</p>
        </div>
      </Link>
    </div>
  )
}

export default SubMenu
