'use client'
import { useEffect, useState } from 'react'

/**
 * ```
 * interface I_DeviceSize {
 * clDeviceSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | null
 * clWindowWidth: number
 *  clWindowHeight: number
 }
 * ```
 */
export interface I_DeviceSize {
  clDeviceSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | null
  clWindowWidth: number
  clWindowHeight: number
}

const useDeviceSize = (): I_DeviceSize => {
  const [clDeviceSize, setdeviceSize] = useState<I_DeviceSize>({
    clDeviceSize: null,
    clWindowWidth: 0,
    clWindowHeight: 0,
  })

  const setValues = (size: I_DeviceSize['clDeviceSize']) => {
    setdeviceSize({
      clDeviceSize: size,
      clWindowHeight: window.innerHeight,
      clWindowWidth: window.innerWidth,
    })
  }

  const updateDeviceSize = () => {
    if (window.innerWidth <= 767) {
      setValues('sm')
    } else if (window.innerWidth >= 768 && window.innerWidth <= 1023) {
      setValues('md')
    } else if (window.innerWidth >= 1024 && window.innerWidth <= 1279) {
      setValues('lg')
    } else if (window.innerWidth >= 1280 && window.innerWidth <= 1535) {
      setValues('xl')
    } else if (window.innerWidth >= 1536 && window.innerWidth <= 1767) {
      setValues('2xl')
    } else if (window.innerWidth >= 1768 && window.innerWidth <= 1919) {
      setValues('3xl')
    } else if (window.innerWidth >= 1920) {
      setValues('4xl')
    }
  }

  useEffect(() => {
    updateDeviceSize()
    window.addEventListener('resize', updateDeviceSize)

    return () => {
      window.removeEventListener('resize', updateDeviceSize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return clDeviceSize
}

export default useDeviceSize
