'use client'
import utilityStore from '@/app/utilities/store/utilityStore'
import { LazyMotion, m } from 'framer-motion'
import React, { ReactNode } from 'react'
import { useStore } from 'zustand'
const loadFeatures = () =>
  import('@/app/utilities/framerMotion/features').then((res) => res.default)

const ProfilePictureContainer = (props: { children: ReactNode }) => {
  const { isBellActive } = useStore(utilityStore)
  const container = {
    small: {
      boxShadow: '0px 0px 45px 0px rgba(40, 140, 204, 0.6)',
      transition: {
        duration: 2,
      },
    },
    large: {
      boxShadow: '0px 0px 120px 0px rgba(40, 140, 204, 1)',
      transition: {
        duration: 2,
      },
    },
  }
  return (
    <>
      <LazyMotion features={loadFeatures}>
        <m.div
          variants={container}
          initial="small"
          animate={isBellActive ? 'large' : 'small'}
          className={
            'w-fit h-fit rounded-full relative md:mx-auto 2xl:mx-[unset]'
          }
        >
          {props.children}
        </m.div>
      </LazyMotion>
    </>
  )
}

export default ProfilePictureContainer
