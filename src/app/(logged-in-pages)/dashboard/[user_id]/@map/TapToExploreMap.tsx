'use client'
import useIntersection from '@/app/hooks/scroll/useIntersection'
import React, { useEffect, useState } from 'react'

const TapToExploreMap = (props: {
  intersectionRef: React.RefObject<HTMLDivElement | null>
}) => {
  const [disableMapScrollOnMbileOnly, setdisableMapScrollOnMbileOnly] =
    useState(true)
  const { intersectionRef } = props
  const { isVisible } = useIntersection(intersectionRef)

  const handleClick = () => {
    setdisableMapScrollOnMbileOnly(false)
  }

  useEffect(() => {
    if (!isVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setdisableMapScrollOnMbileOnly(true)
    }
  }, [isVisible])
  return (
    <div
      className={`absolute inset-0 bg-white/40 z-10 ${
        disableMapScrollOnMbileOnly
          ? 'flex md:hidden items-center justify-center'
          : 'hidden'
      }`}
      onClick={handleClick}
    >
      <p
        className={
          'text-center max-w-[200px] mx-auto text-balance text-lg leading-tight text-primary'
        }
      >
        Tap to explore the impact map
      </p>
    </div>
  )
}

export default TapToExploreMap
