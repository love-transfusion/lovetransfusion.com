'use client'
import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import Input from '@/app/components/inputs/basic-input/Input'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supa_reset_password_for_email } from './actions'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'

interface I_ForgotPassword {
  email: string
}

const ForgotPassword = () => {
  const { settoast } = useStore(utilityStore)
  const [isSuccessful, setisSuccessful] = useState<boolean>(false)
  const { handleSubmit, register, formState } = useForm<I_ForgotPassword>()
  const { isSubmitting } = formState

  const onSubmit = async (payload: I_ForgotPassword) => {
    const error = await supa_reset_password_for_email(payload)
    if (error) {
      settoast({ clDescription: error, clStatus: 'error' })
    } else {
      setisSuccessful(true)
      settoast({
        clDescription: 'Confirmation email sent.',
        clStatus: 'success',
      })
    }
  }
  return (
    <div className={'pb-10 pt-10 md:pb-[70px] md:pt-[64px]'}>
      <div className={'container md:px-6 lg:px-10 xl:px-0 '}>
        <div className={'md:max-w-[440px] mx-auto mb-[25px] px-5'}>
          <p
            className={
              'text-2xl md:text-[35px] font-acumin-variable-68 font-bold text-primary leading-tight'
            }
          >
            Forgot Password
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={
              'md:max-w-[440px] mx-auto rounded-lg shadow-custom2 px-6 py-10 md:py-[70px] md:px-[80px]'
            }
          >
            <div className={'flex flex-col gap-6'}>
              <p className={'text-primary text-lg text-center'}>
                {`${
                  !isSuccessful
                    ? 'Please Enter Your Email to Receive Confirmation Email'
                    : 'We sent a verification email to confirm your identity.'
                }`}
              </p>
              <div className={'flex flex-col gap-1'}>
                <label className="text-[#999]" htmlFor="email">
                  Email *
                </label>
                <Input
                  disabled={isSuccessful}
                  clPlaceholder="Email address"
                  {...register('email')}
                  className={
                    isSuccessful
                      ? 'bg-neutral-200 text-neutral-400 border-neutral-200'
                      : ''
                  }
                />
              </div>

              <Button
                clType="submit"
                clVariant="outlined"
                clDisabled={isSubmitting || isSuccessful}
                className={`border-none rounded-[4px] flex py-1 shadow-[0_0_15px_0_rgba(40,140,204,0.30)] h-[46px] items-center pr-5 ${
                  (isSubmitting || isSuccessful) &&
                  'bg-neutral-300 hover:bg-neutral-300'
                }`}
              >
                <div
                  className={
                    'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
                  }
                >
                  <p
                    className={'mx-auto text-center font-acumin-variable-90'}
                  >
                    Send OTP
                  </p>
                  <div className={'pl-[19px]'}>
                    <Icon_right5 className="size-[19px]" />
                  </div>
                </div>
              </Button>
              <p className={'text-[#6b7280] text-[14px] text-center'}>
                <Link href={'/login'} className="text-primary">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </form>
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

export default ForgotPassword
