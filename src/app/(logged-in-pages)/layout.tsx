import React from 'react'
import dots from './images/Dots.svg'
import doubleHeart from './images/Double Heart.svg'
import NavigationMenu from './NavigationMenu'
import Image from 'next/image'
import PublicFooter from '../components/this-website-only/footer/PublicFooter'
import RecipientName from './dashboard/RecipientName'
import { getCurrentUser } from '../config/supabase/getCurrentUser'
import { isAdmin } from '../lib/adminCheck'
import SetStore from './SetStore'
import MobileDashboardMenu from './MobileDashboardMenu'
import ltLogo from '@/app/images/main-logo.png'

// interface I_MembersLayout

export const maxDuration = 60

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
              'bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-[#DFEEFA8F] max-sm:pt-2 max-sm:pb-[7px] md:min-h-[84px] pl-3 pr-3 2xl:pl-[60px] 2xl:pr-11 flex flex-col justify-center items-center gap-[6px] flex-wrap'
            }
          >
            <div className={'block md:hidden w-full mt-1'}>
              <Image
                src={ltLogo}
                alt="Love Transfusion Logo"
                quality={100}
                className="max-w-[240px] md:max-w-[300px] mx-auto w-full"
              />
            </div>
            <div
              className={
                'flex 2xl:gap-[183px] items-center w-full justify-between 2xl:justify-normal'
              }
            >
              <div className={'flex gap-[11px] items-center'}>
                <MobileDashboardMenu clIsAdmin={isadmin} />
                <div className="flex gap-[40px] xl:gap-[90px]">
                  <p
                    className={
                      'font-acumin-variable-90 md:text-lg 2xl:text-2xl tracking-[3px] md:tracking-[5.8px] -mt-[1px]'
                    }
                  >
                    DASHBOARD
                  </p>
                  <Image
                    src={dots}
                    alt="dots"
                    quality={100}
                    className="hidden xl:block"
                  />
                  <div className={'hidden md:flex gap-[17px] ml-[5px]'}>
                    <Image
                      src={doubleHeart}
                      alt="dots"
                      quality={100}
                      className="hidden lg:block"
                    />
                    <p
                      className={
                        'font-acumin-variable-102 text-xl 2xl:text-[26px] text-nowrap hidden lg:block mt-[1px] font-light'
                      }
                    >
                      Love Transfusion In Progress
                    </p>
                    <Image
                      src={doubleHeart}
                      className="hidden lg:block"
                      alt="dots"
                      quality={100}
                    />
                  </div>
                </div>
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
      <SetStore />
      <PublicFooter />
    </>
  )
}

export default UserIDLayout
