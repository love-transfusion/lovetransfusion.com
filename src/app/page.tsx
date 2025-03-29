import Image from 'next/image'
import Button from './components/Button/Button'
import Icon_right5 from './components/icons/Icon_right5'
import WistiaPlayer from './components/WistiaPlayer'
import child from '@/app/images/homepage/child-circle.png'
import brandLogo from '@/app/images/homepage/brand-logo.svg'
import logIn from '@/app/images/homepage/Receive.svg'
import receive from '@/app/images/homepage/LogIn.svg'
import register from '@/app/images/homepage/Register.svg'
import PublicNavigationMenu from './components/this-website-only/navigation-menu/desktop/PublicNavigationMenu'
import PublicFooter from './components/this-website-only/footer/PublicFooter'
import Link from 'next/link'

const Homepage = () => {
  return (
    <>
      {/* Navigation Menu 2 */}
      <PublicNavigationMenu />
      {/* Section 2 */}
      <div
        className={
          'pb-10 pt-10 md:pb-[67px] md:pt-[65px] border-4 border-r-0 border-[#B0E0F1] flex flex-col'
        }
      >
        <div className={'container md:px-6 lg:px-10 xl:px-0'}>
          <p
            className={
              'font-acuminCondensedBold text-2xl md:text-[35px] text-primary text-center'
            }
          >
            Connecting People Who Hurt With Those Who Care
          </p>
          <p
            className={
              'text-[17px] md:text-[19px] text-[#999] text-center mt-[13px] leading-tight'
            }
          >
            A Conduit for Expressions of Love and Support
          </p>
          <div
            className={
              'flex flex-col lg:flex-row gap-[56px] w-full mx-auto max-w-[935px] mt-8 md:mt-[61px]'
            }
          >
            <div
              className={
                'shadow-custom1 rounded-lg flex gap-2 w-full lg:min-w-[631px]'
              }
            >
              <WistiaPlayer
                videoId={'ow4kttqlhy'}
                containerStyle="shadow-lg bg-[#3082C4]"
              />
            </div>
            <div className={'flex flex-col'}>
              <div className={'relative mt-[2px] w-fit mx-auto lg:mx-[unset]'}>
                <Image
                  src={child}
                  alt="child"
                  quality={100}
                  width={217.572}
                  height={222.081}
                  className="rounded-full ml-[2px] ring-[6px] border-[5px] border-white ring-[#288CCC] drop-shadow-[0px_0px_18px_rgba(40,140,204,0.53)] max-sm:max-w-[205px]"
                />
                <Image
                  src={brandLogo}
                  alt="logo"
                  width={67}
                  height={68}
                  quality={100}
                  className="absolute ml-[2px] -bottom-[4px] right-[4px]"
                />
              </div>
              <p
                className={
                  'font-acuminCondensedBold text-primary text-[22px] mt-[27px]'
                }
              >
                Emotional Support Network
              </p>
              <p
                className={
                  'text-[#999] mt-[5px] leading-tight text-center lg:text-left'
                }
              >
                Provided free of charge for families battling serious illness,
                courtesy of the Love Transfusion community.
              </p>
            </div>
          </div>
        </div>
        {/* Register & Login */}
        <div
          className={'container md:px-6 lg:px-10 xl:px-0 mt-10 md:mt-[58px]'}
        >
          <div
            className={
              'flex flex-col md:flex-row md:divide-x md:divide-primary-200 gap-4 md:gap-[unset] justify-center'
            }
          >
            <div className={'flex flex-col items-center px-[37px]'}>
              <p
                className={
                  'text-xl md:text-[24px] text-primary font-acuminCondensedRegular text-center mb-2 md:mb-4'
                }
              >
                NEW RECIPIENTS
              </p>
              <Link href={'https://www.lovetransfusion.org/submit-story'}>
                <Button
                  clVariant="outlined"
                  className="border-none rounded-[4px] flex py-1 shadow-[0_0_15px_0_rgba(40,140,204,0.30)] w-[259px] h-[46px] items-center pr-5"
                >
                  <div
                    className={
                      'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
                    }
                  >
                    <p
                      className={
                        'text-[22px] mx-auto text-center font-acuminProLight'
                      }
                    >
                      Register
                    </p>
                    <div className={'pl-[19px]'}>
                      <Icon_right5 className="size-[19px]" />
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
            <div className={'flex flex-col items-center px-[37px]'}>
              <p
                className={
                  'text-xl md:text-[24px] text-primary font-acuminCondensedRegular text-center mb-2 md:mb-4'
                }
              >
                RETURNING RECIPIENTS
              </p>
              <Link href={'/login'}>
                <Button
                  clVariant="outlined"
                  className="border-none rounded-[4px] flex py-1 shadow-[0_0_15px_0_rgba(40,140,204,0.30)] w-[259px] h-[46px] items-center pr-5"
                >
                  <div
                    className={
                      'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
                    }
                  >
                    <p
                      className={
                        'text-[22px] mx-auto text-center font-acuminProLight'
                      }
                    >
                      Login
                    </p>
                    <div className={'pl-[19px]'}>
                      <Icon_right5 className="size-[19px]" />
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* How it works */}
        <div className={'container md:px-6 lg:px-10 xl:px-0 mt-[50px]'}>
          <div
            className={'flex items-center gap-3 md:gap-5 max-w-[920px] mx-auto'}
          >
            <div className={'flex border-t w-full h-[1px] mt-[6px]'} />
            <p
              className={
                'text-nowrap font-acuminCondensedBold text-[#E6E6E6] text-[23px] md:text-[32px] tracking-[4px]'
              }
            >
              HOW IT WORKS
            </p>
            <div className={'flex border-t w-full h-[1px] mt-[6px]'} />
          </div>
          <div
            className={
              'flex flex-col md:flex-row gap-8 md:gap-[unset] justify-between text-center mt-3 max-w-[808px] mx-auto relative'
            }
          >
            <div className={'flex flex-col items-center'}>
              <p
                className={'font-acuminCondensedRegular text-3xl text-primary'}
              >
                Register
              </p>
              <p
                className={
                  'text-[#4D4D4D] tracking-[0.48px] max-w-[190px] mt-[3px] mb-[10px] leading-[1.2em]'
                }
              >
                Tell Us About The Recipient
              </p>
              <Image src={register} alt="Register" quality={100} />
            </div>
            <div className={'flex flex-col items-center'}>
              <p
                className={'font-acuminCondensedRegular text-3xl text-primary'}
              >
                Login
              </p>
              <p
                className={
                  'text-[#4D4D4D] tracking-[0.48px] max-w-[190px] mt-[3px] mb-[10px] leading-[1.2em]'
                }
              >
                Private, Secure and Easy To Use
              </p>
              <Image src={logIn} alt="Register" quality={100} />
            </div>
            <div className={'flex flex-col items-center'}>
              <p
                className={'font-acuminCondensedRegular text-3xl text-primary'}
              >
                Receive
              </p>
              <p
                className={
                  'text-[#4D4D4D] tracking-[0.48px] max-w-[190px] mt-[3px] mb-[10px] leading-[1.2em]'
                }
              >
                Expressions of Love and Support
              </p>
              <Image src={receive} alt="Register" quality={100} />
            </div>
            <div
              className={
                'hidden md:flex border-t border-primary-100 absolute bottom-16 left-0 right-0 mx-auto md:max-w-[580px] lg:max-w-[680px] -z-10'
              }
            />
          </div>
          <p
            className={
              'italic text-primary text-[17px] text-center mt-[55px] font-acuminProMedium'
            }
          >
            {`"`}One word frees us of all the weight and pain in life. That word is
            <span
              className={`relative before:absolute before:bottom-[13px] before:left-[6px] before:w-9 before:h-[3px] before:content-[url('/images/underline.svg')]`}
            >
              {' '}
              Love
            </span>
            .{`"`} <span className="text-sm">~Sophocles</span>
          </p>
        </div>
      </div>
      {/* Footer */}
      <PublicFooter />
    </>
  )
}

export default Homepage
