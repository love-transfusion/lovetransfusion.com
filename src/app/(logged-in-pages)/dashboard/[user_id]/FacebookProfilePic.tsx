'use client'
import Image from 'next/image'
import React from 'react'

const FacebookProfilePic = (props: { fbProfilePicURL?: string | null }) => {
  const { fbProfilePicURL } = props
  return (
    <Image
      src={
        fbProfilePicURL ??
        `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/images/user.webp`
      }
      width={37.8}
      height={37.8}
      onError={(e) => {
        e.currentTarget.src = `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/images/user.webp`
      }}
      alt="Profile picture of engager"
      className="border-[3px] border-[#288CCC] rounded-full w-[37.7px] h-[37.7px]"
      unoptimized
    />
  )
}

export default FacebookProfilePic
