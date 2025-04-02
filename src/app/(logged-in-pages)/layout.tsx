import React from 'react'
import dots from './images/Dots.svg'
import doubleHeart from './images/Double Heart.svg'
import NavigationMenu from './NavigationMenu'
import Image from 'next/image'
import Icon_menu from '../components/icons/Icon_menu'
import PublicFooter from '../components/this-website-only/footer/PublicFooter'
import RecipientName from './dashboard/RecipientName'
import { getCurrentUser } from '../config/supabase/getCurrentUser'
import { isAdmin } from '../lib/adminCheck'

// interface I_MembersLayout

const UserIDLayout = async ({
  children,
}: {
  children: React.ReactNode
  params: Promise<{ user_id: string }>
}) => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  return (
    <>
      <div
        className={
          'grid grid-cols-1 2xl:grid-cols-[263px_calc(100%-263px)] max-w-[100vw]'
        }
      >
        <NavigationMenu clIsAdmin={isadmin} />
        <div className="h-full flex flex-col w-full">
          <div
            className={
              'bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-[#DFEEFA8F] min-h-[84px] pl-3 pr-3 2xl:pl-7 2xl:pr-11 flex items-center'
            }
          >
            <div
              className={
                'flex 2xl:gap-[98px] items-center justify-between w-full'
              }
            >
              <div className={'flex gap-[11px] items-center'}>
                <Icon_menu className="size-6 text-white 2xl:hidden" />
                <p className={'md:text-lg 2xl:text-2xl tracking-[3px]'}>
                  DASHBOARD
                </p>
              </div>
              <Image
                src={dots}
                alt="dots"
                quality={100}
                className="hidden lg:block"
              />
              <div className={'hidden md:flex gap-[15px]'}>
                <Image
                  src={doubleHeart}
                  alt="dots"
                  quality={100}
                  className="hidden lg:block"
                />
                <p
                  className={
                    'text-xl 2xl:text-[26px] italic text-nowrap hidden lg:block -tracking-[0.3px] mt-[2px]'
                  }
                >
                  Love Transfusion In Progress
                </p>
                <Image src={doubleHeart} alt="dots" quality={100} />
              </div>
              <RecipientName />
            </div>
          </div>
          <div
            className={'border-4 border-r-0 border-[#B0E0F1] h-full relative'}
          >
            {children}
            {/* <Loader /> */}
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  )
}

export default UserIDLayout
