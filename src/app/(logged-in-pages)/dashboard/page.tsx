import React from 'react'
import SlidingSupportersName from './SlidingSupportersName'
import MapChart from './MapChart'
import RecipientProfilePicture from './RecipientProfilePicture'
import ripple from './images/ripple.png'
import arrow from './images/arrow.png'
import carlo from './images/carlo.webp'
import Image from 'next/image'
import ltWebsiteIcon from './images/world-w.svg'
import hugs from './images/hugs.png'
import messages from './images/MESSAGES.png'
import shares from './images/SHARES.png'
import DividerText from '@/app/components/DividerText'
import ShowOrHide from './ShowOrHide'

// EFF7FC
const DashboardPage = () => {
  return (
    <div className="">
      <SlidingSupportersName />
      <div
        className={
          'grid grid-cols-[208px_1fr_337px] pt-[46px] pb-[50px] pl-[45px] pr-[30px] border-b-4 border-[#B0E0F1]'
        }
      >
        <div className={'text-center'}>
          <RecipientProfilePicture />
          <p className={'font-acuminProSemibold text-[26px] mt-2 text-primary'}>
            Adley
          </p>
          <p className={'text-primary-200 text-xl'}>RECIPIENT</p>
          <div className={'relative flex flex-col items-end w-full h-5'}>
            <div
              className={
                'grid grid-cols-[70px_1fr] w-fit text-white bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] rounded-lg gap-2 md:gap-4 px-[13px] py-[4px] mt-[90px] z-10 absolute right-0 left-0 mx-auto min-w-[172px]'
              }
            >
              <Image
                src={ripple}
                alt="ripple"
                quality={100}
                width={70}
                height={68}
                className="w-[70px] h-[68px]"
              />
              <div className={''}>
                <p className={''}>TOTAL</p>
                <p
                  className={
                    'font-acuminProSemibold text-[36px] leading-tight -mt-[2px]'
                  }
                >
                  23,456
                </p>
              </div>
            </div>
            <Image
              src={arrow}
              alt="arrow"
              quality={100}
              className="absolute top-4 left-[79px] my-auto"
            />
          </div>
        </div>
        <div className={'w-full pt-[26px]'}>
          <MapChart />
          <div className={'flex gap-6 pl-[15px] mt-16'}>
            <div className={'text-center'}>
              <p className={'uppercase text-2xl text-primary-300'}>hugs</p>
              <div
                className={
                  'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-6 mt-5 rounded-lg'
                }
              >
                <Image src={hugs} quality={100} alt="hugs" />
                <p
                  className={
                    'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-[26px] pt-[6px] pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
                  }
                >
                  23,456
                </p>
              </div>
            </div>
            <div className={'text-center'}>
              <p className={'uppercase text-2xl text-primary-300'}>messages</p>
              <div
                className={
                  'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-6 mt-5 rounded-lg'
                }
              >
                <Image src={messages} quality={100} alt="hugs" />
                <p
                  className={
                    'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-[26px] pt-[6px] pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
                  }
                >
                  23,456
                </p>
              </div>
            </div>
            <div className={'text-center'}>
              <p className={'uppercase text-2xl text-primary-300'}>shares</p>
              <div
                className={
                  'flex gap-3 items-center bg-white shadow-[0px_0px_20px_0px_#2FABDD9C] py-3 px-6 mt-5 rounded-lg'
                }
              >
                <Image src={shares} quality={100} alt="hugs" />
                <p
                  className={
                    'rounded-lg bg-gradient-to-r from-[#2F8EDD] to-[#2FBADD] text-white text-[26px] pt-[6px] pb-[5px] px-3 font-acuminProSemibold leading-tight min-w-[123px]'
                  }
                >
                  23,456
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            'pl-[10px] pr-[18px] -mt-[6px] max-h-[586px] overflow-hidden relative'
          }
        >
          <div
            className={
              'h-32 w-full bg-gradient-to-t from-[#FFFFFF] to-[#FFFFFF00] absolute -bottom-4'
            }
          />
          <p
            className={
              'mx-5 bg-gradient-to-b from-[#2F8FDD] to-[#2EB4DB] pt-2 pb-[6px] text-center text-white uppercase rounded-t-lg'
            }
          >
            Most Recent
          </p>
          <div
            className={
              'bg-[#EEF6FC] rounded-lg text-sm shadow-[0px_0px_12px_0px_#288CCC45]'
            }
          >
            <div
              className={
                'flex justify-between text-[12px] text-primary pl-16 px-6 leading-tight py-[7px]'
              }
            >
              <p className={''}>NAME</p>
              <p className={''}>SOURCE</p>
            </div>
            <div className={'divide-y divide-primary-200'}>
              {new Array(13).fill(' ').map((item, index) => {
                return (
                  <div
                    key={index}
                    className={
                      'flex gap-2 justify-between px-4 py-[7px] first:bg-white first:scale-105 first:text-base first:shadow-[0px_0px_15px_0px_#2FABDD40] first:border-t first:border-primary first:rounded-[4px]'
                    }
                  >
                    <div className={'flex items-center gap-3'}>
                      <Image
                        src={carlo}
                        alt="Profile picture of engager"
                        quality={100}
                        width={37.8}
                        height={37.8}
                        className="border-[3px] border-[#288CCC] rounded-full"
                      />
                      <p className={'text-[#009933]'}>Carlo Tubigon</p>
                    </div>
                    <Image
                      src={ltWebsiteIcon}
                      alt="LT Website Icon"
                      quality={100}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={'flex items-start gap-[50px] py-7 px-10 bg-[#EFF7FC]'}>
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
      </div>
    </div>
  )
}

export default DashboardPage