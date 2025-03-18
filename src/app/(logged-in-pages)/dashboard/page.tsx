import React from 'react'
import SlidingSupportersName from './SlidingSupportersName'
import MapChart from './MapChart'
import RecipientProfilePicture from './RecipientProfilePicture'
import ripple from './images/ripple.png'
import arrow from './images/arrow.png'
import Image from 'next/image'
import hugs from './images/hugs.png'
import messages from './images/MESSAGES.png'
import shares from './images/SHARES.png'
import MostRecentEngagements from './MostRecentEngagements'
import ShowOrHide from './ShowOrHide'
import carlo from './images/carlo.webp'
import DividerText from '@/app/components/DividerText'
import HugsMessagesShares from './HugsMessagesShares'

// EFF7FC
const DashboardPage = () => {
  return (
    <div className="">
      <SlidingSupportersName />
      {/* Profile and Map Section */}
      <div
        className={
          'flex flex-wrap xl:flex-nowrap gap-5 xl:gap-0 pt-[30px] xl:pt-[46px] pb-[38px] xl:pb-[50px] pl-0 md:pl-10 2xl:pl-[45px] pr-0 md:pr-[34px] 2xl:pr-[30px] border-b-4 border-[#B0E0F1]'
        }
      >
        <div
          className={
            'max-sm:flex max-sm:flex-wrap max-sm:items-center max-sm:gap-5 min-w-[208px] pt-4 xl:pt-[unset] max-sm:w-full max-sm:px-4'
          }
        >
          <RecipientProfilePicture />
          <div className={'mt-2 text-left md:text-center'}>
            <p
              className={
                'font-acuminProSemibold text-lg md:text-[26px] text-primary'
              }
            >
              Adley
            </p>
            <p className={'text-primary-200 text-sm md:text-xl'}>RECIPIENT</p>
          </div>
          <div className={'relative flex flex-col items-end h-fit'}>
            <div
              className={
                'grid grid-cols-[auto_1fr] md:grid-cols-[70px_1fr] w-fit text-white bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] shadow-[0px_0px_30px_0px_#288CCC47] rounded-lg gap-2 md:gap-4 px-2 md:px-[13px] py-[4px] md:mt-[90px] z-10 md:absolute right-0 left-0 mx-auto md:min-w-[172px] items-center text-left md:text-center'
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
              <div className={''}>
                <p className={'max-sm:text-[12px]'}>TOTAL</p>
                <p
                  className={
                    'font-acuminProSemibold text-sm md:text-2xl 2xl:text-[36px] leading-tight -mt-[2px]'
                  }
                >
                  1,234
                </p>
              </div>
            </div>
            <Image
              src={arrow}
              alt="arrow"
              quality={100}
              className=" max-sm:hidden absolute top-4 left-[79px] my-auto"
            />
          </div>
        </div>
        <div
          className={
            'w-full md:max-w-[445px] lg:max-w-[695px] xl:max-w-full max-sm:pt-5 lg:pt-[10px] 2xl:pt-[26px]'
          }
        >
          <MapChart />
          <div className={'hidden xl:block'}>
            <HugsMessagesShares />
          </div>
        </div>
        <div className={'mx-auto max-sm:w-full'}>
          <div className={'xl:hidden'}>
            <HugsMessagesShares />
          </div>
          <MostRecentEngagements />
        </div>
      </div>
      {/* Messages Section */}
      {/* <div className={'flex items-start gap-[50px] py-7 px-10 bg-[#EFF7FC]'}>
        <div className={'min-w-[900px]'}>
          <DividerText clBorderTopClassName="border-[#92CCED]">
            <p className={'text-nowrap text-2xl uppercase text-[#B3D8F3]'}>
              messages
            </p>
          </DividerText>
          <div
            className={
              'rounded-lg shadow-[0px_0px_25.27px_0px_#2FABDD40] overflow-hidden mt-8'
            }
          >
            <div
              className={
                'bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] h-4 w-full rounded-t-md'
              }
            />
            <div className={'divide-y divide-primary'}>
              {new Array(7).fill('test').map((item, index) => {
                return (
                  <div
                    key={index}
                    className={'px-9 even:bg-white odd:bg-[#F7FCFF] py-[23px]'}
                  >
                    <div className={'flex justify-between items-center gap-6'}>
                      <div className={'flex gap-6 items-center'}>
                        <div
                          className={
                            'w-[60px] h-[60px] border-[3px] border-[#288CCC] rounded-full overflow-hidden relative'
                          }
                        >
                          <Image
                            src={carlo}
                            alt="Profile picture of adley"
                            quality={100}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className={''}>
                          <p
                            className={
                              'text-lg font-acuminProSemibold text-[#009933]'
                            }
                          >
                            Carlo Tubigon
                          </p>
                          <p className={'text-primary'}>
                            Sending BIG HUGS and many prayers…you got this
                            Benny!
                          </p>
                        </div>
                      </div>
                      <p
                        className={
                          'uppercase bg-[#2F8EDD] text-white p-[2px] text-[10px] text-nowrap h-fit rounded-md px-2 py-[2px]'
                        }
                      >
                        hide message
                      </p>
                    </div>
                  </div>
                )
              })}
              <div className={'even:bg-white odd:bg-[#F7FCFF]'}>
                <p className={'text-primary underline text-center py-4'}>
                  Load more messages...
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={'w-full'}>
          <ShowOrHide />
          <div
            className={
              'p-3 bg-[#2F8EDD] rounded-[4px] mt-8 text-white relative'
            }
          >
            <div
              className={
                'bg-gradient-to-r p-3 rounded-[4px] from-[#2F8EDD] to-[#2FA2DD]'
              }
            >
              <p className={'font-acuminProSemibold'}>PARENTS:</p>
              <div className={'flex flex-col gap-2'}>
                <p className={''}>
                  You have full{' '}
                  <span className="font-acuminProSemibold">control</span> over
                  messages.
                </p>
                <p className={''}>
                  They are all displayed by default, however, you may hide them{' '}
                  <span className="font-acuminProSemibold">individually</span>{' '}
                  or hide <span className="font-acuminProSemibold">all</span>{' '}
                  messages using the toggle switch above.
                </p>
              </div>
            </div>
            <div className="border-r-[35px] border-y-[25px] border-[#2F8EDD] border-y-transparent absolute -left-[35px] top-0 bottom-0 my-auto h-fit" />
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default DashboardPage
