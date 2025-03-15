'use client'
import { useState } from 'react'

const useToggle = () => {
  const [clisToggled, setclisToggled] = useState<boolean>(false)
  const clToggle = () => {
    setclisToggled((prev) => !prev)
  }
  return { clisToggled, clToggle }
}

export default useToggle
