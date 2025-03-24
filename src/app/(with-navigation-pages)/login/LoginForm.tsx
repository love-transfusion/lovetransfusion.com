'use client'
import React from 'react'
import PasswordField from './PasswordField'
import Link from 'next/link'
import Input from '@/app/components/inputs/basic-input/Input'
import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import { useForm } from 'react-hook-form'
import { supa_signin } from '@/app/(auth)/(login)/actions'
import { I_Auth_LoginRequiredData } from '@/types/auth.types'
import { useStore } from 'zustand'
import utilityStore from '@/app/utilities/store/utilityStore'

const LoginForm = () => {
  const { settoast } = useStore(utilityStore)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<I_Auth_LoginRequiredData>()

  const onSubmit = async (rawData: I_Auth_LoginRequiredData) => {
    localStorage.setItem('dashboard-modal', 'true')
    const error = await supa_signin({ clRawData: rawData })
    if (error) {
      settoast({ clDescription: error, clStatus: 'error' })
    }
  }

  return (
    <form className={'flex flex-col gap-6'} onSubmit={handleSubmit(onSubmit)}>
      <div className={'flex flex-col gap-1'}>
        <label className="text-[#999]" htmlFor="email">
          Email *
        </label>
        <Input
          clPlaceholder="Email address"
          id="email"
          {...register('email', {
            required: 'Enter your email address',
            pattern: {
              value: /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/i,
              message: 'Please enter a valid email',
            },
          })}
          clErrorMessage={errors.email?.message}
        />
      </div>
      <div className={'flex flex-col gap-1'}>
        <label className="text-[#999]" htmlFor="Password">
          Password *
        </label>
        <div className={''}>
          <PasswordField clRegister={register} errors={errors} />
          <p className={'text-[12px] text-primary text-right mt-1 mb-[2px]'}>
            <Link href={'/forgot-password'}>Forgot password?</Link>
          </p>
        </div>
      </div>

      <Button
        clDisabled={isSubmitting}
        clType="submit"
        clVariant="outlined"
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
            {isSubmitting ? 'Logging in...' : 'Login'}
          </p>
          <div className={'pl-[19px]'}>
            <Icon_right5 className="size-[19px]" />
          </div>
        </div>
      </Button>
      <p className={'text-[#6b7280] text-[12px] text-center'}>
        {`Don't`} have an account?{' '}
        <Link
          href={'https://www.lovetransfusion.org/submit-story'}
          className="text-primary"
        >
          Request one here
        </Link>
        .
      </p>
    </form>
  )
}

export default LoginForm
