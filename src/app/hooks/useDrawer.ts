'use client'
import { useState } from 'react'
import Drawer from '@/app/components/Drawer'

const useDrawer = () => {
  const [clIsOpen, setisOpen] = useState<boolean>(false)

  const clToggleDrawer = (bool?: boolean) => {
    if (bool === false) {
      setisOpen(bool)
    } else {
      setisOpen((prev) => !prev)
    }
  }

  return { clIsOpen, clToggleDrawer, Drawer }
}

export default useDrawer
