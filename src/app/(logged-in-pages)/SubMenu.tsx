'use client'
import React from 'react'
import utilityStore from '../utilities/store/utilityStore'
import { useStore } from 'zustand'
import dashboard from './images/dashboard-icon.svg'
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
    <div className={'mt-[60px] flex flex-col gap-[5px]'}>
      <p className={'text-[#DFEEFA8F] mb-[13px]'}>MAIN MENU</p>
      {clIsAdmin && (
        <Link href={`/admin`}>
          <div
            className={
              'flex gap-[7px] items-center text-xl font-acumin-semi-condensed font-light'
            }
          >
            <Icon_cog className="size-[34px] ml-1" />
            <p className={'ml-1'}>Manage Recipients</p>
          </div>
        </Link>
      )}
      <Link href={`/dashboard/${userInStore?.id}`}>
        <div
          className={
            'flex gap-[7px] items-center text-xl font-acumin-semi-condensed font-light'
          }
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
          className={
            'flex gap-[7px] items-center text-xl font-acumin-semi-condensed font-light'
          }
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
          className={
            'flex gap-[7px] items-center text-xl font-acumin-semi-condensed font-light'
          }
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
