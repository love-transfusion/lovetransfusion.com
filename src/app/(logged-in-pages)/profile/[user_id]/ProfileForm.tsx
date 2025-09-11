'use client'
import React, { useState } from 'react'
import BasicInformation from './BasicInformationTab'
import ProfileSecurity from './ProfileSecurity'
import { I_supa_select_user_Response_Types } from '@/app/_actions/users/actions'

type I_Tabs = 'basic information' | 'security'

export interface I_ProfileForm {
  recipientName: string
  fullName: string
  email: string
  birthday?: string
}
export interface I_UserWithProfilePicture extends I_supa_users_row {
  profile_pictures: I_supa_profile_pictures_row_unextended | null
}
const ProfileForm = ({ user }: { user: I_supa_select_user_Response_Types }) => {
  const [activeTab, setactiveTab] = useState<I_Tabs>('basic information')

  const handleSwitchTabs = (tab: I_Tabs) => {
    setactiveTab(tab)
  }

  return (
    <>
      <div className={'flex md:max-w-[440px] mx-auto'}>
        <div
          className={`px-3 pt-1 pb-2 rounded-md cursor-pointer ${
            activeTab === 'security'
              ? 'text-neutral-400 bg-primary-50'
              : 'bg-primary-100'
          }`}
          onClick={() => handleSwitchTabs('basic information')}
        >
          <p className={''}>Basic Information</p>
        </div>
        <div
          className={`px-3 pt-1 pb-2 rounded-md cursor-pointer ${
            activeTab === 'basic information'
              ? 'text-neutral-400 bg-primary-50'
              : 'bg-primary-100'
          }`}
          onClick={() => handleSwitchTabs('security')}
        >
          <p className={''}>Security</p>
        </div>
      </div>
      <div
        className={
          'md:max-w-[440px] mx-auto rounded-lg shadow-custom2 px-6 py-10 md:py-[40px] md:px-[60px]'
        }
      >
        {activeTab === 'basic information' && <BasicInformation user={user} />}
        {activeTab === 'security' && <ProfileSecurity user={user} />}
      </div>
    </>
  )
}

export default ProfileForm
