'use client'
import Image from 'next/image'

const FacebookProfilePic = (props: { commentator_id: string | null }) => {
  return (
    // <Image
    //   src={
    //     fbProfilePicURL ??
    //     `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/images/user.webp`
    //   }
    //   width={37.8}
    //   height={37.8}
    //   onError={(e) => {
    //     e.currentTarget.src = `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/images/user.webp`
    //   }}
    //   alt="Profile picture of engager"
    //   className="border-[3px] border-[#288CCC] rounded-full w-[37.7px] h-[37.7px]"
    //   unoptimized
    // />
    <Image
      src={`/api/meta/avatar/${props.commentator_id}/64`}
      className="border-[3px] border-[#288CCC] rounded-full w-[37.7px] h-[37.7px]"
      // width={37.8}
      // height={37.8}
      alt="Profile picture of engager"
    />
  )
}

export default FacebookProfilePic
