import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import helpCenter from './images/help-center-icon.svg'
import questionMark from './images/questionMark.svg'
import aboutUsIcon from './images/about-us-icon.svg'
import messageIcon from './images/messageIcon.svg'
import mousePointer from './images/mousePointerIcon.svg'
import SignoutContainerComponent from '../(auth)/signout/SignoutContainerComponent'

const SubMenuBottom = () => {
  return (
    <>
      <div className={'mt-[60px] flex flex-col gap-[5px]'}>
        <p className={'text-[#DFEEFA8F] mb-[13px]'}>HELP & SUPPORT</p>
        <Link href={'/help-center'}>
          <div
            className={
              'flex gap-[7px] items-center text-xl font-acumin-semi-condensed'
            }
          >
            <Image
              src={questionMark}
              alt="heart"
              quality={100}
              className="size-[43px]"
            />
            <p className={''}>FAQ</p>
          </div>
        </Link>
        <Link href={'/help-center'}>
          <div
            className={
              'flex gap-[7px] items-center text-xl font-acumin-semi-condensed'
            }
          >
            <Image
              src={helpCenter}
              alt="heart"
              quality={100}
              className="size-[43px]"
            />
            <p className={''}>Help Center</p>
          </div>
        </Link>
      </div>
      <div className={'mt-[60px] flex flex-col gap-[5px]'}>
        <p className={'text-[#DFEEFA8F] mb-[13px]'}>MORE</p>
        <Link href={'/about-us'}>
          <div
            className={
              'flex gap-[7px] items-center text-xl font-acumin-semi-condensed'
            }
          >
            <Image
              src={aboutUsIcon}
              alt="heart"
              quality={100}
              className="size-[43px]"
            />
            <p className={''}>About Us</p>
          </div>
        </Link>
        <Link href={'/contact-us'}>
          <div
            className={
              'flex gap-[7px] items-center text-xl font-acumin-semi-condensed'
            }
          >
            <Image
              src={messageIcon}
              alt="heart"
              quality={100}
              className="size-[43px]"
            />
            <p className={''}>Contact Us</p>
          </div>
        </Link>
        <div
          className={
            'flex gap-[7px] items-center text-xl font-acumin-semi-condensed'
          }
        >
          <Image
            src={mousePointer}
            alt="heart"
            quality={100}
            className="size-[43px]"
          />
          <SignoutContainerComponent>
            <p className={'active:text-primary-300 select-none'}>Logout</p>
          </SignoutContainerComponent>
        </div>
      </div>
    </>
  )
}

export default SubMenuBottom
