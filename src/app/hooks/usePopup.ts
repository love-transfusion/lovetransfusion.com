'use client'

import Popup from '../components/Popup'
import { useState } from 'react'

const usePopup = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clPopupData, setpopup] = useState<any | null>(null)

  const clClosePopup = () => {
    setpopup(null)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clOpenPopup = (data: any) => {
    setpopup(data)
  }

  return { clClosePopup, clOpenPopup, clPopupData, Popup }
}

export default usePopup
