'use client'

import { twMerge } from 'tailwind-merge'

interface I_Toggle {
  clIsToggled: boolean
  clContainerStyle?: string
  clToggleStyle?: string
  clToggle: () => void
}

const Toggle = ({
  clContainerStyle,
  clToggleStyle,
  clIsToggled,
  clToggle,
}: I_Toggle) => {
  return (
    <div
      className={twMerge(
        'relative bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] w-[56px] p-1 rounded-full cursor-pointer',
        clContainerStyle
      )}
      onClick={clToggle}
    >
      <div
        className={twMerge(
          `bg-[#E2F0FA] size-6 rounded-full ${
            clIsToggled ? 'mr-auto' : 'ml-auto'
          }`,
          clToggleStyle
        )}
      />
    </div>
  )
}

export default Toggle
