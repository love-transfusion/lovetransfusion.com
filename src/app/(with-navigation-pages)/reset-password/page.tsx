'use client'
import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import React from 'react'
import { useForm } from 'react-hook-form'
import { supa_update_password_action } from './actions'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'
import PasswordField from '../login/PasswordField'

interface I_password {
  password: string
  confirmPassword: string
}

const ResetPasswordPage = () => {
  const { settoast } = useStore(utilityStore)
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<I_password>()
  const onSubmit = async (rawData: I_password) => {
    if (rawData.password !== rawData.confirmPassword) return
    localStorage.setItem('dashboard-modal', 'true')
    const { error } = await supa_update_password_action(rawData.password)
    if (error) {
      localStorage.removeItem('dashboard-modal')
      settoast({ clDescription: error, clStatus: 'error' })
    }
  }
  return (
    <div className={'pb-10 pt-10 md:pb-[70px] md:pt-[64px]'}>
      <div className={'container md:px-6 lg:px-10 xl:px-0 '}>
        <div className={'md:max-w-[440px] mx-auto mb-[25px] px-5'}>
          <p
            className={
              'text-2xl md:text-[35px] font-acuminCondensedBold text-primary leading-tight'
            }
          >
            Reset Password
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={
              'md:max-w-[440px] mx-auto rounded-lg shadow-custom2 px-6 py-10 md:py-[70px] md:px-[80px]'
            }
          >
            <div className={'flex flex-col gap-6'}>
              <div className={'flex flex-col gap-1'}>
                <label className="text-[#999]" htmlFor="email">
                  New password *
                </label>
                <PasswordField clRegister={register} fieldName="password" />
              </div>
              <div className={'flex flex-col gap-1'}>
                <label className="text-[#999]" htmlFor="email">
                  Confirm password *
                </label>
                <PasswordField
                  clRegister={register}
                  fieldName="confirmPassword"
                />
              </div>

              <Button
                clType="submit"
                clVariant="outlined"
                clDisabled={isSubmitting}
                className={`border-none rounded-[4px] flex py-1 shadow-[0_0_15px_0_rgba(40,140,204,0.30)] h-[46px] items-center pr-5 ${
                  isSubmitting && 'bg-neutral-300 hover:bg-neutral-300'
                }`}
              >
                <div
                  className={
                    'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
                  }
                >
                  <p className={'mx-auto text-center font-acuminProLight'}>
                    Update Password
                  </p>
                  <div className={'pl-[19px]'}>
                    <Icon_right5 className="size-[19px]" />
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </form>
        <p
          className={
            'italic text-primary text-[18px] text-center mt-9 md:mt-[49px] font-acuminProLight'
          }
        >
          {`"`}One word frees us of all the weight and pain in life. That word
          is
          <span
            className={`relative before:absolute before:bottom-[13px] before:left-[6px] before:w-9 before:h-[3px] before:content-[url('/images/underline.svg')]`}
          >
            {' '}
            Love{`"`}
          </span>
          . <span className="text-sm">~Sophocles</span>
        </p>
      </div>
    </div>
  )
}

export default ResetPasswordPage
