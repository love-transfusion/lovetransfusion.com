import React from 'react'

const ProfileLoading = () => {
  return (
    <div className={'pb-10 pt-10 md:pb-[70px] md:pt-[64px]'}>
      <div className={'container md:px-6 lg:px-10 xl:px-0 '}>
        <div className={'md:max-w-[440px] mx-auto mb-[25px] px-5'}>
          <div
            className={
              'w-[196px] bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-10 rounded-md mb-2'
            }
          />
          <div
            className={
              'w-full bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-4 rounded-md'
            }
          />
        </div>
        <div
          className={
            'md:max-w-[440px] mx-auto bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-[475px] rounded-md mb-12'
          }
        />
        <div
          className={
            'w-[80%] mx-auto bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse h-4 rounded-md'
          }
        />
      </div>
    </div>
  )
}

export default ProfileLoading
