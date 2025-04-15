import PasswordField from '@/app/(with-navigation-pages)/login/PasswordField'
import { supa_update_password_action } from '@/app/_actions/authentication/actions'
import Button from '@/app/components/Button/Button'
import utilityStore from '@/app/utilities/store/utilityStore'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useStore } from 'zustand'
import { I_UserWithProfilePicture } from './ProfileForm'

interface I_SecurityData {
  password: string
  confirmPassword: string
}

const ProfileSecurity = ({ user }: { user: I_UserWithProfilePicture }) => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<I_SecurityData>()
  const { settoast } = useStore(utilityStore)

  const onSubmit = async (rawData: I_SecurityData) => {
    if (rawData.password === rawData.confirmPassword) {
      const { data, error } = await supa_update_password_action(
        rawData.password,
        user.id
      )
      if (data) {
        settoast({
          clDescription: 'Password successfully updated.',
          clStatus: 'success',
        })
      } else if (error) {
        settoast({ clDescription: error, clStatus: 'error' })
      }
    } else {
      settoast({ clDescription: 'Passwords did not match.', clStatus: 'error' })
    }
  }
  return (
    <div className="animate-slide-in-right">
      <form className={'flex flex-col gap-6'} onSubmit={handleSubmit(onSubmit)}>
        <div className={'flex flex-col gap-1'}>
          <label className="text-[#999]" htmlFor="email">
            New Password *
          </label>
          <PasswordField
            fieldName="password"
            clRegister={register}
            errors={errors}
          />
        </div>
        <div className={'flex flex-col gap-1'}>
          <label className="text-[#999]" htmlFor="email">
            Confirm Password *
          </label>
          <PasswordField
            fieldName="confirmPassword"
            clRegister={register}
            errors={errors}
          />
        </div>
        <Button
          clType="submit"
          className={`${isSubmitting && 'bg-neutral-300 hover:bg-neutral-300'}`}
        >
          {isSubmitting ? 'Updating Password...' : 'Update Password'}
        </Button>
      </form>
    </div>
  )
}

export default ProfileSecurity
