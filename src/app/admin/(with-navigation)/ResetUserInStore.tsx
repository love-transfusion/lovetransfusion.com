'use client'
import utilityStore from '@/app/utilities/store/utilityStore'
import React, { useEffect } from 'react'
import { useStore } from 'zustand'

const ResetUserInStore = () => {
  const { setuserInStore } = useStore(utilityStore)
  useEffect(() => {
    setuserInStore(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div></div>
}

export default ResetUserInStore
