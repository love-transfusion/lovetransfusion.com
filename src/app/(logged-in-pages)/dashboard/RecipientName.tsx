'use client'
import utilityStore from '@/app/utilities/store/utilityStore'
import React from 'react'
import { useStore } from 'zustand'

const RecipientName = () => {
  const { userInStore } = useStore(utilityStore)
  return (
    <>
      {userInStore?.first_name ? (
        <div
          className={
            '2xl:text-xl text-[#ffffffad] flex gap-[10px] 2xl:pl-[110px]'
          }
        >
          <p className={''}>RECIPIENT:</p>
          <p className="font-acuminProMedium tracking-[0.5px]">
            {userInStore.first_name}
          </p>
        </div>
      ) : (
        <div
          className={
            'w-[100px] bg-gradient-to-br from-primary-50 to-primary-200 opacity-50 animate-pulse h-6 rounded-md'
          }
        />
      )}
    </>
  )
}

export default RecipientName
