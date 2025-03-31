'use client'
import { useEffect, useState } from 'react'

interface I_DeviceSize {
  deviceSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | null
}

const useDeviceSize = (): I_DeviceSize['deviceSize'] => {
  const [deviceSize, setdeviceSize] = useState<
    I_DeviceSize['deviceSize'] | null
  >(null)

  const updateDeviceSize = () => {
    if (window.innerWidth <= 767) {
      setdeviceSize('sm')
    } else if (window.innerWidth >= 768 && window.innerWidth <= 1023) {
      setdeviceSize('md')
    } else if (window.innerWidth >= 1024 && window.innerWidth <= 1279) {
      setdeviceSize('lg')
    } else if (window.innerWidth >= 1280 && window.innerWidth <= 1535) {
      setdeviceSize('xl')
    } else if (window.innerWidth >= 1536 && window.innerWidth <= 1920) {
      setdeviceSize('2xl')
    } else if (window.innerWidth >= 1930) {
      setdeviceSize('3xl')
    }
  }

  useEffect(() => {
    updateDeviceSize()
    window.addEventListener('resize', updateDeviceSize)

    return () => {
      window.removeEventListener('resize', updateDeviceSize)
    }
  }, [])
  return deviceSize
}

export default useDeviceSize
