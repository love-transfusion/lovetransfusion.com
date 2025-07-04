import Button from '@/app/components/Button/Button'
import Link from 'next/link'
import React from 'react'
import ContactMessageForm from './ContactMessageForm'
import ContactInformation from './ContactInformation'
import FaqItems from './FaqItems'

const HelpCenterPage = () => {
  return (
    <div className={'pb-10 pt-10 md:pb-20 md:pt-[63px]'}>
      <div className={'max-w-[950px] mx-auto md:px-6 lg:px-10 xl:px-4'}>
        <p
          className={
            'font-acumin-variable-68 font-bold text-[#b3d8f3] text-center text-[35px]'
          }
        >
          HELP CENTER
        </p>
        <div
          className={
            'flex flex-col md:flex-row gap-2 justify-between items-center mt-10'
          }
        >
          <p
            className={
              'font-acumin-variable-68 font-semibold text-primary text-center text-2xl md:text-[28px]'
            }
          >
            Frequently Asked Questions...
          </p>
          <Link href={'/contact-us'}>
            <Button className="rounded">Contact Us</Button>
          </Link>
        </div>
        <FaqItems />
        <div className={'px-4 md:px-8 mt-8'}>
          <p
            className={
              'font-acumin-variable-68 text-primary text-[28px] mb-[13px] pl-[26px]'
            }
          >
            Message Us
          </p>
          <div className={'flex flex-col lg:flex-row gap-10'}>
            <ContactMessageForm />
            <ContactInformation />
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
    </div>
  )
}

export default HelpCenterPage
