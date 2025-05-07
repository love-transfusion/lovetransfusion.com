'use client'
import React, { useEffect } from 'react'
import Icon_menu from '../../icons/Icon_menu'
import useDrawer from '@/app/hooks/useDrawer'
import ltLogo from '@/app/(logged-in-pages)/images/Logo Icon.svg'
import Image from 'next/image'
import { getFormattedDate } from '@/app/(logged-in-pages)/NavigationMenu'
import Link from 'next/link'
import aboutUsIcon from '@/app/(logged-in-pages)/images/About.svg'
import messageIcon from '@/app/(logged-in-pages)/images/Contact.svg'
import helpCenter from '@/app/(logged-in-pages)/images/Help.svg'
import dashboard from '@/app/(logged-in-pages)/images/dashboard-new.svg'
import privacy from '@/app/(logged-in-pages)/images/privacy.svg'
import { usePathname } from 'next/navigation'

export const MenuTopPart = () => {
  return (
    <div className="mt-4">
      <Image
        src={ltLogo}
        alt="Love Transfusion Logo"
        quality={100}
        className="mx-auto"
      />
      <p className={'text-center mt-6 mb-3'}>LOVE TRANSFUSION</p>
      <p className={'text-center mb-6'}>Support Platform</p>
      <p className={'text-center py-3 border-y border-primary-300'}>
        {getFormattedDate()}
      </p>
    </div>
  )
}

const MobilePublicNavigation = () => {
  const path = usePathname()
  const { clIsOpen, clToggleDrawer, Drawer } = useDrawer()
  useEffect(() => {
    clToggleDrawer(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])
  return (
    <div className="block md:hidden">
      <Icon_menu
        className="min-w-7 min-h-7 cursor-pointer"
        onClick={() => clToggleDrawer()}
      />
      <Drawer
        clIsOpen={clIsOpen}
        clToggleDrawer={clToggleDrawer}
        clMoveLeftToRight
        className="text-white px-9"
        clWidth={{ sm: '80%', bigScreens: '50%' }}
        clStyle={{
          background:
            'linear-gradient(rgb(47, 142, 221) 0%, rgb(47, 157, 221) 33%, rgb(47, 171, 221) 69%, rgb(47, 186, 221) 97%)',
        }}
      >
        <MenuTopPart />
        <div>
          <div className={'mt-[77px]'}>
            <p className={'text-[#DFEEFA8F] mb-[13px] font-light uppercase'}>
              main menu
            </p>
            <Link href={'/'}>
              <div
                className={
                  'flex gap-[7px] items-center text-xl font-acumin-variable-90'
                }
              >
                <Image
                  src={dashboard}
                  alt="heart"
                  quality={100}
                  className="size-[43px]"
                />
                <p className={'capitalize'}>home</p>
              </div>
            </Link>
            <Link href={'/privacy-policy'}>
              <div
                className={
                  'flex gap-[7px] items-center text-xl font-acumin-variable-90'
                }
              >
                <Image
                  src={privacy}
                  alt="heart"
                  quality={100}
                  className="size-[43px]"
                />
                <p className={'capitalize'}>privacy</p>
              </div>
            </Link>
          </div>
          <div className={'mt-[57px]'}>
            <p className={'text-[#DFEEFA8F] mb-[13px] font-light uppercase'}>
              help & support
            </p>
            <Link href={'/help-center'}>
              <div
                className={
                  'flex gap-[7px] items-center text-xl font-acumin-variable-90'
                }
              >
                <Image
                  src={helpCenter}
                  alt="heart"
                  quality={100}
                  className="size-[43px]"
                />
                <p className={'capitalize'}>help center</p>
              </div>
            </Link>
          </div>
          <div className={'mt-[57px]'}>
            <p className={'text-[#DFEEFA8F] mb-[13px] font-light uppercase'}>
              more
            </p>
            <Link href={'/about-us'}>
              <div
                className={
                  'flex gap-[7px] items-center text-xl font-acumin-variable-90'
                }
              >
                <Image
                  src={aboutUsIcon}
                  alt="heart"
                  quality={100}
                  className="size-[43px]"
                />
                <p className={'capitalize'}>about us</p>
              </div>
            </Link>
            <Link href={'/contact-us'}>
              <div
                className={
                  'flex gap-[7px] items-center text-xl font-acumin-variable-90'
                }
              >
                <Image
                  src={messageIcon}
                  alt="heart"
                  quality={100}
                  className="size-[43px]"
                />
                <p className={'capitalize'}>contact us</p>
              </div>
            </Link>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default MobilePublicNavigation
