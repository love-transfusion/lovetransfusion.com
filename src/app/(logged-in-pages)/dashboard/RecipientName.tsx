'use client'
import utilityStore from '@/app/utilities/store/utilityStore'
import { useStore } from 'zustand'

const RecipientName = () => {
  const { userInStore } = useStore(utilityStore)
  return (
    <>
      {userInStore?.first_name ? (
        <div
          className={
            'text-lg md:text-2xl flex gap-2 md:gap-[11px]'
          }
        >
          <p className={'font-light font-acumin-variable-92'}>RECIPIENT:</p>
          <p className="font-acumin-variable-96 -mt-[1px] font-light capitalize">
            {userInStore.first_name}
          </p>
        </div>
      ) : (
        <div
          className={'flex w-full justify-end xl:justify-start max-w-[200px]'}
        >
          <div
            className={
              'w-[120px] md:w-[200px] lg:w-[138px] xl:w-[200px] bg-gradient-to-br from-primary-50 to-primary-200 opacity-90 md:opacity-50 animate-pulse h-7 md:h-6 rounded-md'
            }
          />
        </div>
      )}
    </>
  )
}

export default RecipientName
