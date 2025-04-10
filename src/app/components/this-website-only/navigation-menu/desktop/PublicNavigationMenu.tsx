import ltLogo from '@/app/images/love-logo.svg'
import heartbeat from '@/app/images/homepage/heartbeat-text.svg'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'
import MobilePublicNavigation from '../MobilePublicNavigation'

interface I_PublicNavigationMenu {
  clUser: I_User | null | undefined
  clIsAdmin: boolean
}

const PublicNavigationMenu = ({
  clUser,
  clIsAdmin,
}: I_PublicNavigationMenu) => {
  return (
    <div
      className={
        'pb-5 pt-5 md:pb-[38px] md:pt-[38px] bg-[linear-gradient(90deg,#2f8edd,#2f9ddd_33%,#2fabdd_69%,#2fbadd_97%)]'
      }
    >
      <div
        className={
          'max-w-[1304px] mx-auto gap-2 md:gap-0 px-2 md:px-6 lg:px-10 xl:px-0 flex justify-between items-center text-white relative'
        }
      >
        <div className={'w-fit flex flex-nowrap items-center gap-2'}>
          <MobilePublicNavigation />
          <Link href={'/'}>
            <Image
              src={ltLogo}
              alt="Love Transfusion logo"
              quality={100}
              className="max-w-[158px] md:max-w-[unset]"
            />
          </Link>
        </div>
        <Image
          src={heartbeat}
          alt="heartbeat"
          quality={100}
          className="hidden lg:block absolute top-0 bottom-0 right-0 left-[14px] m-auto w-[209px] h-[75.63px]"
        />
        <div className={'flex gap-[12.5px] items-center'}>
          <div
            className={
              'hidden lg:flex items-center overflow-y-hidden font-acumin-variable font-extralight text-[15px] gap-2'
            }
          >
            <Link href={'/about-us'}>
              <p>About Us</p>
            </Link>
            <p className={''}>|</p>
            <Link href={'/help-center'}>
              <p>FAQ</p>
            </Link>
            <p className={''}>|</p>
            <Link href={'/contact-us'}>
              <p>Contact Us</p>
            </Link>
          </div>
          <Link href={'/login'}>
            <Button
              clVariant="outlined"
              className="border-2 border-[#e5e7eb] rounded-md flex py-[2px] shadow-[0_0_12px_0_#288ccc45] pl-[7px] pr-[10px]"
            >
              <div className={'flex items-center divide-opacity-50'}>
                <p
                  className={
                    'pl-2 pr-2 md:pl-6 md:pr-[17px] text-[13px] md:text-sm font-acumin-variable line-clamp-1 max-w-[130px]'
                  }
                >
                  {`${
                    clUser
                      ? clIsAdmin
                        ? 'Admin'
                        : clUser.users_data_website.length > 0 &&
                          clUser.users_data_website[0].recipient.first_name
                      : 'Login'
                  }`}
                </p>
                <span className={'text-[#DFEEFA8F]'}>|</span>
                <div className={'pl-[15px]'}>
                  <Icon_right5 className="w-[11px] h-[9.89px]" />
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PublicNavigationMenu
