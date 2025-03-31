import SignoutContainerComponent from '@/app/(auth)/signout/SignoutContainerComponent'
import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { isAdmin } from '@/app/lib/adminCheck'
import React from 'react'
interface I_WithNavigationLayout {
  children: React.ReactNode
}
const WithNavigationLayout = async ({ children }: I_WithNavigationLayout) => {
  const user = await getCurrentUser()
  isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })
  return (
    <>
      <div
        className={
          'absolute top-0 left-0 w-full bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] py-[28.5px] px-8 flex justify-end bg-[#F3F4F6] z-[999]'
        }
      >
        <SignoutContainerComponent>
          <p
            className={'text-lg text-white active:text-primary-300 select-none'}
          >
            Logout
          </p>
        </SignoutContainerComponent>
      </div>
      <div className={'pt-[85px]'}>{children}</div>
    </>
  )
}

export default WithNavigationLayout
