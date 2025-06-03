'use client'
import Button from '@/app/components/Button/Button'
import Image from 'next/image'
import modalLogo from './images/modal-logo.svg'
import Icon_close from '@/app/components/icons/Icon_close'
import { useEffect, useState } from 'react'

const WelcomeMessage = () => {
  const [isOpen, setisOpen] = useState<boolean>(false)
  const localName = 'dashboard-modal'

  const handleCloseModal = () => {
    setisOpen(false)
  }

  useEffect(() => {
    const isInLocalStorage = !!localStorage.getItem(localName)
    if (isInLocalStorage) {
      setisOpen(true)
    }
    localStorage.removeItem(localName)
  }, [])
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 w-full h-full z-[99]">
          <div
            className={`lg:w-[950px] max-h-[95vh] md:h-fit bg-white absolute inset-3 m-auto pb-6 shadow-lg animate-slide-up border-[10px] border-[#2F8EDD] rounded-[26px]`}
          >
            <div className={'relative pb-10 lg:pb-[unset] md:px-[20px]'}>
              <div className={'pt-4 pr-5 md:pr-0'}>
                <div
                  onClick={handleCloseModal}
                  className={
                    'bg-[#2F8EDD] w-8 h-8 max-w-8 rounded-full p-1 shadow-md cursor-pointer ml-auto flex items-center py-3'
                  }
                >
                  <Icon_close className="text-white" />
                </div>
              </div>
              <Image
                src={modalLogo}
                alt="LT Logo"
                quality={100}
                className="absolute -top-[40px] max-w-[198px] left-0 right-0 mx-auto"
              />
              <div
                className={
                  'px-5 md:px-[50px] max-sm:overflow-y-auto max-sm:h-[82vh]'
                }
              >
                <p
                  className={
                    'font-acuminProSemibold text-2xl text-[#2f8edd] text-center pt-[86px] font-bold'
                  }
                >
                  Welcome to Your Love Transfusion Dashboard!
                </p>
                <p className={'leading-[28px] mt-[22px]'}>
                  We have begun raising awareness about your story, and, as you
                  are about to see, many people have already expressed their
                  love and support for you through social media and our sister
                  site, LoveTransfusion.org.{' '}
                  <span className="font-bold">
                    In some cases, you may see placeholder names and pictures
                  </span>{' '}
                  instead of real ones due to privacy limitations of the various
                  platforms, but please know{' '}
                  <span className="font-acuminProSemibold">
                    that every expression of support is genuine and comes from a
                    real person.
                  </span>
                </p>
                <p className={'mt-[30px]'}>
                  Thank you for allowing us to share your journey.
                </p>
                <Button
                  onClick={handleCloseModal}
                  className="rounded-[10px] bg-[#2f8edd] px-[45px] py-[9px] mt-[42px] mx-auto"
                >
                  Click Here To Continue
                </Button>
                <p className="text-[12px] text-primary mt-4 text-center">{`Love Transfusion Inc is a 501(c)(3) Nonprofit Organization`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default WelcomeMessage
