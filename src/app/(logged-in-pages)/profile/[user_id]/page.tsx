import React from 'react'
import ProfileForm from './ProfileForm'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { isAdmin } from '@/app/lib/adminCheck'
import { supa_select_user } from '@/app/_actions/users/actions'

type Params = Promise<{ user_id: string }>

interface I_ProfilePage {
  params: Params
}

const ProfilePage = async (props: I_ProfilePage) => {
  const { user_id } = await props.params
  const user = await getCurrentUser()
  const { data: userObj } = await supa_select_user(user_id)
  if (
    !userObj ||
    !user_id ||
    !user ||
    (user_id !== user.id && !isAdmin({ clRole: user.role }))
  )
    notFound()
  const users_data_website = userObj.users_data_website
  return (
    <div className={'pb-10 pt-10 md:pb-[70px] md:pt-[64px]'}>
      <div className={'container md:px-6 lg:px-10 xl:px-0 '}>
        <div className={'md:max-w-[440px] mx-auto mb-[25px] px-5'}>
          <p
            className={
              'text-2xl md:text-[35px] font-acumin-variable-68 font-bold text-primary leading-tight'
            }
          >
            Profile Settings
          </p>
          <p
            className={
              'text-lg md:text-xl font-acumin-variable-90 text-[#999] mt-[3px]'
            }
          >
            Update your name and profile image
          </p>
        </div>

        <ProfileForm user={userObj} users_data_website={users_data_website} />
        <p className={'italic text-primary text-lg text-center mt-[48px]'}>
          {`"`}One word frees us of all the weight and pain in life. That word
          is
          <span
            className={`relative before:absolute before:bottom-[15px] before:left-1 before:w-9 before:h-[3px] before:content-[url('/images/underline.svg')]`}
          >
            {' '}
            Love
          </span>
          .{`"`} <span className="text-sm ml-[2px]">~Sophocles</span>
        </p>
      </div>
    </div>
  )
}

export default ProfilePage
