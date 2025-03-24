import React from 'react'
import { twMerge } from 'tailwind-merge'

interface I_Popup {
  container?: string
  children: React.ReactNode
  clClosePopup: () => void
}

const Popup = ({ container, children }: I_Popup) => {
  return (
    <div className={twMerge('fixed inset-0 w-full h-full z-[998]', container)}>
      <div
        className={
          'relative w-full h-full bg-black bg-opacity-50 backdrop-blur-[2px]'
        }
      >
        <div
          className={
            'w-[950px] h-[516px] bg-white absolute inset-3 m-auto shadow-lg p-5 animate-slide-up border-[10px] border-[#2F8EDD] rounded-[26px]'
          }
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Popup
