'use client'
import React from 'react'
import { useStore } from 'zustand'
import dynamic from 'next/dynamic'
import utilityStore from './utilities/store/utilityStore'

const Toast = dynamic(() => import('./components/Toast'), { ssr: false })

const GlobalToast = () => {
  const { toast } = useStore(utilityStore)
  return <>{toast && <Toast />}</>
}

export default GlobalToast
