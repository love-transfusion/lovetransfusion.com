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
import { getCurrentUser } from './config/supabase/getCurrentUser'
import { isAdmin } from './lib/adminCheck'

const Homepage = async () => {
  const user = await getCurrentUser()
  const isadmin = isAdmin({ clRole: user?.role })
  return (
    <>
      {/* Navigation Menu 2 */}
      <PublicNavigationMenu clUser={user} clIsAdmin={isadmin} />
      {/* Section 2 */}
      <div
        className={
          'pb-10 pt-10 md:pb-[64px] md:pt-[64px] border-4 border-r-0 border-[#B0E0F1] flex flex-col'
        }
      >
        <div className={'container md:px-6 lg:px-10 xl:px-0'}>
          <p
            className={
              'font-acumin-condensed font-bold text-2xl md:text-[35px] text-primary text-center'
            }
          >
            Connecting People Who Hurt With Those Who Care
          </p>
          <p
            className={
              'font-acumin-semi-condensed font-medium text-[17px] md:text-xl text-[#999] text-center mt-2'
            }
          >
            A Conduit for Expressions of Love and Support
          </p>
          <div
            className={
              'flex flex-col lg:flex-row gap-[54px] w-full mx-auto max-w-[940px] mt-8 md:mt-[61px]'
            }
          >
            <div
              className={
                'shadow-custom1 rounded-lg flex gap-2 w-full lg:w-[633px]'
              }
            >
              <WistiaPlayer
                videoId={'ow4kttqlhy'}
                containerStyle="shadow-lg bg-[#3082C4]"
              />
            </div>
            <div
              className={'flex flex-col max-w-[235px] mx-auto md:mx-[unset]'}
            >
              <div className={'relative mt-[1px] w-fit mx-auto'}>
                <Image
                  src={child}
                  alt="child"
                  quality={100}
                  width={205}
                  height={206}
                  className="rounded-full ring-[6px] border-[4px] border-white ring-[#288CCC] drop-shadow-[0px_0px_18px_rgba(40,140,204,0.53)] max-sm:max-w-[205px] min-w-[213px]"
                />
                <Image
                  src={brandLogo}
                  alt="logo"
                  width={67}
                  height={68}
                  quality={100}
                  className="absolute ml-[2px] -bottom-[6px] -right-[6px]"
                />
              </div>
              <p
                className={
                  'font-acumin-condensed font-bold text-primary text-[23px] mt-[22px] mb-1 pl-[1px]'
                }
              >
                Emotional Support Network
              </p>
              <p
                className={
                  'font-acumin-semi-condensed-92 leading-[22px] text-[#999] text-center lg:text-left'
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
          className={'container md:px-6 lg:px-10 xl:px-0 mt-10 md:mt-[53px]'}
        >
          <div
            className={
              'flex flex-col md:flex-row md:divide-x md:divide-primary-200 gap-4 md:gap-[unset] justify-center'
            }
          >
            <div
              className={'flex flex-col items-center px-[37px] pt-1 pb-[2px]'}
            >
              <p
                className={
                  'text-xl md:text-[24px] text-primary font-acumin-condensed text-center mb-2 md:mb-4'
                }
              >
                NEW RECIPIENTS
              </p>
              <Link href={'https://www.lovetransfusion.org/submit-story'}>
                <Button
                  clVariant="outlined"
                  className="border-none rounded-[4px] flex pt-[5px] pb-1 shadow-[0_0_15px_0_rgba(40,140,204,0.30)] w-[256px] h-[47px] items-center pr-[18px]"
                >
                  <div className={'flex items-center justify-between my-auto'}>
                    <p
                      className={
                        'text-[22px] mx-auto text-center font-acumin-semi-condensed-95 font-extralight pr-[4px]'
                      }
                    >
                      Register
                    </p>
                    <p
                      className={
                        'font-acumin-condensed color-[#dfeefa8f] opacity-60 font-extralight'
                      }
                    >
                      |
                    </p>
                    <div className={'pl-[18px]'}>
                      <Icon_right5 className="w-[19px] h-[17.5px]" />
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
            <div
              className={'flex flex-col items-center px-[37px] pt-1 pb-[2px]'}
            >
              <p
                className={
                  'text-xl md:text-[24px] text-primary font-acumin-condensed text-center mb-2 md:mb-4'
                }
              >
                RETURNING RECIPIENTS
              </p>
              <Link href={'/login'}>
                <Button
                  clVariant="outlined"
                  className="border-none rounded-[4px] flex pt-[5px] pb-1 shadow-[0_0_15px_0_rgba(40,140,204,0.30)] w-[256px] h-[47px] items-center pr-5"
                >
                  <div className={'flex items-center justify-between my-auto'}>
                    <p
                      className={
                        'text-[22px] mx-auto text-center font-acumin-semi-condensed-95 font-extralight pr-4'
                      }
                    >
                      Login
                    </p>
                    <p
                      className={
                        'font-acumin-condensed color-[#dfeefa8f] opacity-60 font-extralight'
                      }
                    >
                      |
                    </p>
                    <div className={'pl-[17px]'}>
                      <Icon_right5 className="w-[19px] h-[17.5px]" />
                    </div>
                  </div>
                </Button>
                {/* <Button
                  clVariant="outlined"
                  className="border-none rounded-[4px] flex pt-[5px] pb-1 shadow-[0_0_15px_0_rgba(40,140,204,0.30)] w-[259px] h-[47px] items-center pr-5"
                >
                  <div
                    className={
                      'flex items-center justify-between my-auto divide-x divide-white divide-opacity-50'
                    }
                  >
                    <p
                      className={
                        'text-[22px] mx-auto text-center font-acumin-semi-condensed-95 font-extralight'
                      }
                    >
                      Login
                    </p>
                    <div className={'pl-[19px]'}>
                      <Icon_right5 className="size-[19px]" />
                    </div>
                  </div>
                </Button> */}
              </Link>
            </div>
          </div>
        </div>
        {/* How it works */}
        <div className={'container md:px-6 lg:px-10 xl:px-0 mt-10'}>
          <div
            className={'flex items-center gap-3 md:gap-3 max-w-[940px] mx-auto'}
          >
            <div className={'flex border-t w-full h-[1px] mt-[3px]'} />
            <p
              className={
                'text-nowrap font-acumin-condensed font-semibold text-[#E6E6E6] text-[23px] md:text-[32px] tracking-[0.1em]'
              }
            >
              HOW IT WORKS
            </p>
            <div className={'flex border-t w-full h-[1px] mt-[6px]'} />
          </div>
          <div
            className={
              'flex flex-col md:flex-row gap-8 md:gap-[unset] justify-between text-center mt-[8px] max-w-[816px] mx-auto relative'
            }
          >
            <div className={'flex flex-col items-center mt-[5px]'}>
              <p
                className={
                  'font-acumin-condensed text-3xl font-medium text-primary'
                }
              >
                Register
              </p>
              <p
                className={
                  'text-[#4D4D4D] max-w-[190px] mt-[3px] mb-[13px] leading-[1.2em]'
                }
              >
                Tell Us About The Recipient
              </p>
              <Image src={register} alt="Register" quality={100} />
            </div>
            <div className={'flex flex-col items-center mt-3'}>
              <p
                className={
                  'font-acumin-condensed text-3xl font-medium text-primary'
                }
              >
                Log In
              </p>
              <p
                className={
                  'text-[#4D4D4D] max-w-[190px] mt-[3px] mb-[10px] leading-[1.2em]'
                }
              >
                Private, Secure and Easy To Use
              </p>
              <Image
                src={logIn}
                alt="Register"
                quality={100}
                className="w-[148px] h-[119.3px] mt-[3px]"
              />
            </div>
            <div className={'flex flex-col items-center'}>
              <p
                className={
                  'font-acumin-condensed text-3xl font-medium text-primary'
                }
              >
                Receive
              </p>
              <p
                className={
                  'text-[#4D4D4D] max-w-[190px] mt-[3px] mb-3 leading-[1.2em]'
                }
              >
                Expressions of Love and Support
              </p>
              <Image
                src={receive}
                alt="Register"
                quality={100}
                className="w-[165px] h-[148.27px]"
              />
            </div>
            <div
              className={
                'hidden md:flex border-t-2 border-[#E6E6E6] absolute bottom-20 left-0 right-0 mx-auto md:max-w-[580px] lg:max-w-[680px] -z-10'
              }
            />
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
      {/* Footer */}
      <PublicFooter />
    </>
  )
}

export default Homepage
