import React from 'react'
import Image from 'next/image'
import ltLogo from './images/Logo Icon.svg'
import helpCenter from './images/help-center-icon.svg'
import questionMark from './images/questionMark.svg'
import aboutUsIcon from './images/about-us-icon.svg'
import messageIcon from './images/messageIcon.svg'
import mousePointer from './images/mousePointerIcon.svg'
import Link from 'next/link'
import SignoutContainerComponent from '../(auth)/signout/SignoutContainerComponent'
import SubMenu from './SubMenu'

// interface I_NavigationMenu {
//   clRecipientRow: I_supa_users_data_website_row
// }

const NavigationMenu = () => {
  const getFormattedDate = (): string => {
    const today: Date = new Date()
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return today.toLocaleDateString('en-US', options)
  }

  return (
    <div
      className={'hidden 2xl:flex flex-col bg-black justify-start items-start'}
    >
      <div className="h-full w-full">
        <div className={'bg-[#2F8EDD] h-[84px]'} />
        <div
          className={
            'bg-gradient-to-b from-[#2F8EDD] to-[#2FBADD] px-5 h-[calc(100%-20px)] text-[#DFEEFA] font-acumin-semi-condensed pb-10'
          }
        >
          <div className={'text-[#E9F5FE] text-center -mt-[64px]'}>
            <Image
              src={ltLogo}
              alt="Love Transfusion Logo"
              quality={100}
              className="mx-auto"
            />
            <p
              className={'text-2xl font-acuminProMedium mt-[14px] text-nowrap'}
            >
              LOVE TRANSFUSION
            </p>
            <p className={'mt-[2px] mb-[19px]'}>Support Platform</p>
            <p className={'border-y border-[#92CCED] py-1 text-lg'}>
              {/* March 13, 2025 */}
              {getFormattedDate()}
            </p>
          </div>
          <SubMenu />
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
        </div>
      </div>
    </div>
  )
}

export default NavigationMenu
