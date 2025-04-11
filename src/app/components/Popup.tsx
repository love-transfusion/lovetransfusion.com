import React from 'react'
import { twMerge } from 'tailwind-merge'
import Icon_close from './icons/Icon_close'

interface I_Popup {
  clContainerStyle?: string
  clIconStyle?: string
  className?: string
  children: React.ReactNode
  clTogglePopup: () => void
  clIsOpen: boolean
  clDisableOutsideClick?: boolean
}

const Popup = ({
  clTogglePopup,
  clContainerStyle,
  clIconStyle,
  children,
  clIsOpen,
  className,
  clDisableOutsideClick,
}: I_Popup) => {
  const handleOutsideClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!clDisableOutsideClick) {
      clTogglePopup()
    }
  }
  const handleCloseIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    clTogglePopup()
  }
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  return (
    <>
      {clIsOpen && (
        <div className="fixed inset-0 w-full z-[1000]">
          <div
            onClick={handleOutsideClick}
            className={twMerge(
              'relative w-full h-full bg-black/50 backdrop-blur-[4px]',
              clContainerStyle
            )}
          >
            <Icon_close
              onClick={handleCloseIconClick}
              className={twMerge(
                'w-14 h-14 md:w-[80px] md:h-[80px] text-white absolute top-5 right-5 cursor-pointer z-10',
                clIconStyle
              )}
            />
            <div
              onClick={handleContentClick}
              className={twMerge(
                'md:w-[552px] h-[300px] bg-white absolute inset-3 m-auto shadow-lg p-5 animate-slide-up rounded-lg overflow-auto',
                className
              )}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Popup
