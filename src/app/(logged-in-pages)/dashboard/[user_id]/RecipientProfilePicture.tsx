import Image from 'next/image'
import React from 'react'
import brandLogo from '@/app/images/homepage/brand-logo.svg'

const RecipientProfilePicture = ({
  recipientObj,
}: {
  recipientObj: I_supaorg_recipient_hugs_counters_comments
}) => {
  return (
    <div
      className={
        'shadow-[0px_0px_45px_0px_#288CCC87] w-fit h-fit rounded-full relative md:mx-auto 2xl:mx-[unset]'
      }
    >
      <div
        className={
          'w-[100px] h-[100px] md:w-[128px] 2xl:w-[196px] md:h-[128px] 2xl:h-[196px] border-[3px] md:border-4 border-white ring-4 md:ring-[6px] ring-[#288CCC] rounded-full overflow-hidden relative'
        }
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_SUPABASE_ORG_STORAGE_URL}/${recipientObj.profile_picture.fullPath}`}
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
        className="absolute -bottom-[7px] 2xl:-bottom-[4px] -right-[6px] 2xl:right-[4px] w-10 h-10 md:w-[50px] 2xl:w-[61px] md:h-[50px] 2xl:h-[61px]"
      />
    </div>
  )
}

export default RecipientProfilePicture
