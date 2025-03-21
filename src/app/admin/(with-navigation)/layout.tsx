import React from 'react'
interface I_WithNavigationLayout {
  children: React.ReactNode
}
const WithNavigationLayout = ({ children }: I_WithNavigationLayout) => {
  return (
    <>
      <div
        className={
          'absolute top-0 left-0 w-full bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] py-[28.5px] px-8 flex justify-end bg-[#F3F4F6] z-[999]'
        }
      >
        <p className={'text-lg text-white'}>Logout</p>
      </div>
      <div className={'pt-[85px]'}>{children}</div>
    </>
  )
}

export default WithNavigationLayout
