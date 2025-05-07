import React from 'react'
import LoginForm from './LoginForm'

const LoginPage = () => {
  return (
    <div className={'pb-10 pt-10 md:pb-[70px] md:pt-[64px]'}>
      <div className={'container md:px-6 lg:px-10 xl:px-0 '}>
        <div className={'md:max-w-[440px] mx-auto mb-[25px] px-5'}>
          <p
            className={
              'text-2xl md:text-[35px] font-acumin-variable-68 font-bold text-primary leading-tight'
            }
          >
            Welcome To Love Transfusion!
          </p>
          <p className={'text-lg md:text-xl font-acumin-variable-90 font-semibold text-[#999] mt-[3px]'}>
            Log into your account...
          </p>
        </div>
        <div
          className={
            'md:max-w-[440px] mx-auto rounded-lg shadow-custom2 px-6 py-10 md:py-[70px] md:px-[80px]'
          }
        >
          <LoginForm />
        </div>
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

export default LoginPage
