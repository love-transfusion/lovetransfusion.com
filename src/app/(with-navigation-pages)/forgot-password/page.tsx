import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import Input from '@/app/components/inputs/basic-input/Input'
import Link from 'next/link'
import React from 'react'

const ForgotPassword = () => {
  return (
    <div className={'pb-10 pt-10 md:pb-[70px] md:pt-[64px]'}>
      <div className={'container md:px-6 lg:px-10 xl:px-0 '}>
        <div className={'md:max-w-[440px] mx-auto mb-[25px] px-5'}>
          <p
            className={
              'text-2xl md:text-[35px] font-acuminCondensedBold text-primary leading-tight'
            }
          >
            Forgot Password
          </p>
        </div>
        <div
          className={
            'md:max-w-[440px] mx-auto rounded-lg shadow-custom2 px-6 py-10 md:py-[70px] md:px-[80px]'
          }
        >
          <div className={'flex flex-col gap-6'}>
            <p className={'text-primary text-lg text-center'}>
              Please Enter Your Email to Receive One Time Password (OTP)
            </p>
            <div className={'flex flex-col gap-1'}>
              <label className="text-[#999]" htmlFor="email">
                Email *
              </label>
              <Input clPlaceholder="Email address" />
            </div>

            <Button
              clVariant="outlined"
              className="border-none rounded-[4px] flex py-1 shadow-[0_0_15px_0_rgba(40,140,204,0.30)] h-[46px] items-center pr-5"
            >
              <div
                className={
                  'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
                }
              >
                <p className={'mx-auto text-center font-acuminProLight'}>
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

export default ForgotPassword
