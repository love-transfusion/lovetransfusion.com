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
  clIsAdmin: boolean
}

const SubMenuBottom = ({ clToggleDrawer, clIsAdmin }: SubMenuBottomTypes) => {
  return (
    <>
      <div
        className={
          'mt-[54px] flex flex-col items-start xl:items-center 2xl:items-start gap-[15px]'
        }
      >
        <p
          className={
            'text-[#DFEEFA8F] mb-[3px] tracking-[0.48px] font-light text-left xl:text-center 2xl:text-left'
          }
        >
          HELP & SUPPORT
        </p>
        {!clIsAdmin && <QuickTour clToggleDrawer={clToggleDrawer} />}
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
            <p className={'-mt-[1px] block xl:hidden 2xl:block'}>Help Center</p>
          </div>
        </Link>
      </div>
      <div
        className={
          'mt-[54px] flex flex-col items-start xl:items-center 2xl:items-start gap-[15px]'
        }
      >
        <p
          className={
            'text-[#DFEEFA8F] mb-[3px] tracking-[0.48px] font-light text-left xl:text-center 2xl:text-left'
          }
        >
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
            <p className={'-mt-[1px] block xl:hidden 2xl:block'}>About Us</p>
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
            <p className={'-mt-[1px] block xl:hidden 2xl:block'}>Contact Us</p>
          </div>
        </Link>
        <div
          className={'flex gap-5 items-center text-xl font-acumin-variable-90'}
        >
          <Image
            src={mousePointer}
            alt="heart"
            quality={100}
            className="size-[28px] block xl:hidden 2xl:block"
          />
          <SignoutContainerComponent>
            <p
              className={
                'active:text-primary-300 select-none xl:text-lg 2xl:text-xl'
              }
            >
              Logout
            </p>
          </SignoutContainerComponent>
        </div>
      </div>
    </>
  )
}

export default SubMenuBottom
