import React from 'react'
import Image from 'next/image'
import hugs from './images/hugs.png'
import messages from './images/MESSAGES.png'
import shares from './images/SHARES.png'
import ripple from './images/ripple.png'

const HugsMessagesShares = () => {
  return (
    <div
      className={
        'flex flex-col md:flex-row gap-3 2xl:gap-6 pl-3 pr-3 md:pl-[15px] mt-[22px] md:mt-12 2xl:mt-16 justify-center 2xl:justify-start'
      }
    >
      <div className={'block md:hidden text-center '}>
        <p className={'uppercase text-xl 2xl:text-2xl text-primary-300'}>
          Total
        </p>
        <div
          className={
            'flex gap-3 items-center text-white bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-4 2xl:px-6 mt-[7px] md:mt-5 rounded-lg w-fit mx-auto'
          }
        >
          <Image
            src={ripple}
            alt="ripple"
            quality={100}
            width={70}
            height={68}
            className="w-10 h-10 md:w-[70px] md:h-[68px]"
          />
          <p
            className={
              'rounded-lg text-white ring-[1px] ring-primary-300 text-xl 2xl:text-[26px] pt-[10px] 2xl:pt-[6px] pb-[9px] 2xl:pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
            }
          >
            999,999,999
          </p>
        </div>
      </div>
      <div className={'text-center'}>
        <p className={'uppercase text-xl 2xl:text-2xl text-primary-300'}>
          hugs
        </p>
        <div
          className={
            'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-4 2xl:px-6 mt-[7px] md:mt-5 rounded-lg w-fit mx-auto'
          }
        >
          <Image src={hugs} quality={100} alt="hugs" />
          <p
            className={
              'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-xl 2xl:text-[26px] pt-[10px] 2xl:pt-[6px] pb-[9px] 2xl:pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
            }
          >
            1,000
          </p>
        </div>
      </div>
      <div className={'text-center'}>
        <p className={'uppercase text-xl 2xl:text-2xl text-primary-300'}>
          messages
        </p>
        <div
          className={
            'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-4 2xl:px-6 mt-[7px] md:mt-5 rounded-lg w-fit mx-auto'
          }
        >
          <Image src={messages} quality={100} alt="hugs" />
          <p
            className={
              'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-xl 2xl:text-[26px] pt-[10px] 2xl:pt-[6px] pb-[9px] 2xl:pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
            }
          >
            100
          </p>
        </div>
      </div>
      <div className={'text-center'}>
        <p className={'uppercase text-xl 2xl:text-2xl text-primary-300'}>
          shares
        </p>
        <div
          className={
            'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-4 2xl:px-6 mt-[7px] md:mt-5 rounded-lg w-fit mx-auto'
          }
        >
          <Image src={shares} quality={100} alt="hugs" />
          <p
            className={
              'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-xl 2xl:text-[26px] pt-[10px] 2xl:pt-[6px] pb-[9px] 2xl:pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
            }
          >
            10
          </p>
        </div>
      </div>
    </div>
  )
}

export default HugsMessagesShares
