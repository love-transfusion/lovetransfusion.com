import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import helpCenter from './images/Help.svg'

import aboutUsIcon from './images/About.svg'
import messageIcon from './images/Contact.svg'
import mousePointer from './images/Logout.svg'
import SignoutContainerComponent from '../(auth)/signout/SignoutContainerComponent'
import QuickTour from './QuickTour'

interface SubMenuBottomTypes {
  clToggleDrawer?: (bool?: boolean | undefined) => void
}

const SubMenuBottom = ({ clToggleDrawer }: SubMenuBottomTypes) => {
  return (
    <>
      <div className={'mt-[54px] flex flex-col gap-[15px]'}>
        <p className={'text-[#DFEEFA8F] mb-[3px] tracking-[0.48px] font-light'}>
          HELP & SUPPORT
        </p>
        <QuickTour clToggleDrawer={clToggleDrawer} />
        <Link href={'/help-center'}>
          <div
            className={
              'flex gap-5 items-center text-xl font-acumin-variable-90'
            }
          >
            <Image
              src={helpCenter}
              alt="heart"
              quality={100}
              className="size-[28px]"
            />
            <p className={'-mt-[1px]'}>Help Center</p>
          </div>
        </Link>
      </div>
      <div className={'mt-[54px] flex flex-col gap-[15px]'}>
        <p className={'text-[#DFEEFA8F] mb-[3px] tracking-[0.48px] font-light'}>
          MORE
        </p>
        <Link href={'/about-us'}>
          <div
            className={
              'flex gap-5 items-center text-xl font-acumin-variable-90'
            }
          >
            <Image
              src={aboutUsIcon}
              alt="heart"
              quality={100}
              className="size-[28px]"
            />
            <p className={'-mt-[1px]'}>About Us</p>
          </div>
        </Link>
        <Link href={'/contact-us'}>
          <div
            className={
              'flex gap-5 items-center text-xl font-acumin-variable-90'
            }
          >
            <Image
              src={messageIcon}
              alt="heart"
              quality={100}
              className="size-[28px]"
            />
            <p className={'-mt-[1px]'}>Contact Us</p>
          </div>
        </Link>
        <div
          className={'flex gap-5 items-center text-xl font-acumin-variable-90'}
        >
          <Image
            src={mousePointer}
            alt="heart"
            quality={100}
            className="size-[28px]"
          />
          <SignoutContainerComponent>
            <p className={'active:text-primary-300 select-none -mt-[1px]'}>
              Logout
            </p>
          </SignoutContainerComponent>
        </div>
      </div>
    </>
  )
}

export default SubMenuBottom
