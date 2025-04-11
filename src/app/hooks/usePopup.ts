'use client'

import Popup from '../components/Popup'
import { useState } from 'react'

const usePopup = () => {
  const [clIsOpen, setpopup] = useState<boolean>(false)

  const clTogglePopup = (bool?: boolean) => {
    if (bool === false) {
      setpopup(bool)
    } else {
      setpopup((prev) => !prev)
    }
  }

  return { clTogglePopup, clIsOpen, Popup }
}

export default usePopup
