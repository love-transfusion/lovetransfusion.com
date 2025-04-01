import React from 'react'
import FaqItems from '../help-center/FaqItems'
import ContactMessageForm from '../help-center/ContactMessageForm'
import ContactInformation from '../help-center/ContactInformation'

const ContactPage = () => {
  return (
    <div className={'pb-10 pt-10 md:pb-20 md:pt-[63px] px-4 md:px-8'}>
      <div className={'max-w-[950px] mx-auto md:px-6 lg:px-10 xl:px-8'}>
        <div className={'xl:mt-8'}>
          <div className={'flex flex-col lg:flex-row gap-10'}>
            <ContactInformation
              clDisableHelpCenter
              clLabelsClassName="text-xl text-left md:w-[124px]"
              cl501ClassName="text-xl"
              clUrlClassName="text-lg"
            />
            <div className={'flex flex-col'}>
              <p
                className={
                  'font-acumin-condensed text-primary text-[28px] mb-[13px] -mt-[5px]'
                }
              >
                Message Us
              </p>
              <ContactMessageForm clContainerClassName="md:min-w-[423px]" />
            </div>
          </div>
        </div>
        <div
          className={
            'flex flex-col md:flex-row gap-2 justify-between items-center mt-10'
          }
        >
          <p
            className={
              'font-acumin-condensed text-primary text-center text-2xl md:text-[28px]'
            }
          >
            Frequently Asked Questions...
          </p>
        </div>
        <FaqItems clContainerClassName="px-0" />
      </div>
    </div>
  )
}

export default ContactPage
