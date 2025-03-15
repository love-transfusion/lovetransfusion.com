import Image from 'next/image'
import React from 'react'
import adleyPic from './images/adley-profile-pic.jpg'
import brandLogo from '@/app/images/homepage/brand-logo.svg'

const RecipientProfilePicture = () => {
  return (
    <div
      className={
        'shadow-[0px_0px_45px_0px_#288CCC87] w-fit h-fit rounded-full relative'
      }
    >
      <div
        className={
          'w-[196px] h-[196px] border-4 border-white ring-[6px] ring-[#288CCC] rounded-full overflow-hidden relative'
        }
      >
        <Image
          src={adleyPic}
          alt="Profile picture of adley"
          quality={100}
          fill
          className="object-cover"
        />
      </div>
      <Image
        src={brandLogo}
        alt="logo"
        width={61}
        height={61}
        quality={100}
        className="absolute -bottom-[4px] right-[4px]"
      />
    </div>
  )
}

export default RecipientProfilePicture
