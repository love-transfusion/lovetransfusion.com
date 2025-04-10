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
          <p className={'font-light'}>RECIPIENT:</p>
          <p className="font-medium tracking-[0.5px] capitalize">
            {userInStore.first_name}
          </p>
        </div>
      ) : (
        <div className={'flex w-full justify-end'}>
          <div
            className={
              'w-[120px] md:w-[200px] bg-gradient-to-br from-primary-50 to-primary-200 opacity-50 animate-pulse h-6 rounded-md'
            }
          />
        </div>
      )}
    </>
  )
}

export default RecipientName
