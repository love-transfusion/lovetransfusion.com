'use client'
import Image from 'next/image'
import Script from 'next/script'
import logo from '@/app/images/logo-white.svg'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

// Don't place it inside div flex

interface VideoData {
  duration: number
  currentTime: number
}

interface WistiaPlayerProps {
  videoId: string
  showData?: boolean
  setvideoData?: ((data: VideoData) => void) | null
  containerStyle?: string
}

declare global {
  interface Window {
    Wistia?: {
      api: (id: string) => {
        bind: (event: string, callback: () => void) => void
        data: { media: { duration: number } }
        controls: { playbar: { getCurrentTime: () => number } }
      }
    }
  }
}

const WistiaPlayer = ({
  videoId,
  showData,
  setvideoData,
  containerStyle,
}: WistiaPlayerProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleLoad = () => {
    console.log({ showData, window })
    if (showData && window.Wistia) {
      const wistia = window.Wistia
      const player = wistia.api(videoId)
      console.log({ wistia, player })

      player.bind('play', () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }

        const duration = player?.data?.media?.duration

        intervalRef.current = setInterval(() => {
          if (!setvideoData) return
          setvideoData({
            duration,
            currentTime: Math.floor(
              player.controls.playbar.getCurrentTime() ?? 0
            ),
          })
        }, 1000)
      })
    }
  }
  return (
    <div className={twMerge('rounded-md overflow-hidden flex-1 flex items-center w-full', containerStyle)}>
      <Script
        strategy="lazyOnload"
        src="//fast.wistia.com/assets/external/E-v1.js"
        onLoad={() => {
          setTimeout(() => {
            handleLoad()
          }, 70)
        }}
      />
      <div className="wistia_responsive_padding w-full pt-[56.25%] px-0 relative">
        <Image
          src={logo}
          alt="LT logo"
          fill
          sizes={'100px'}
          className="text-primary bg-primary-200 p-[8%]"
        />
        <div className="wistia_responsive_wrapper h-[100%] w-full left-0 absolute top-0">
          <div
            className={`wistia_embed ${
              videoId && `wistia_async_${videoId}`
            } videoFoam=true h-[100%] w-full`}
          >
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  )
}

export default WistiaPlayer
