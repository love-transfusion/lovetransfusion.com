'use client'
import Image from 'next/image'
import prayer_notification from './images/prayer-notification.svg'
import useAnimation from '@/app/hooks/useAnimation'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'

const PrayerNotification = () => {
  const { isBellActive } = useStore(utilityStore)
  const { clAnimationStyles, ClAnimationContainer, ClMotionDiv } = useAnimation(
    { animationStyle: 'fade', animationDuration: 1.5 }
  )
  return (
    <ClAnimationContainer>
      {isBellActive && (
        <ClMotionDiv className="" {...clAnimationStyles}>
          <Image
            src={prayer_notification}
            quality={100}
            alt="prayer notification"
            className="max-w-[65px] lg:max-w-[75px] xl:max-w-[100px]"
          />
        </ClMotionDiv>
      )}
    </ClAnimationContainer>
  )
}

export default PrayerNotification
