'use client'
import { useState } from 'react'

const useToggle = (status?: boolean) => {
  const [clisToggled, setclisToggled] = useState<boolean>(status ?? false)
  const clToggle = () => {
    setclisToggled((prev) => !prev)
  }
  return { clisToggled, clToggle }
}

export default useToggle
