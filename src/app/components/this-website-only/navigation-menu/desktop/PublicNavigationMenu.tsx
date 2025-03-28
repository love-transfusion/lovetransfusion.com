import ltLogo from '@/app/images/love-logo.svg'
import heartbeat from '@/app/images/homepage/heartbeat-text.svg'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/app/components/Button/Button'
import Icon_right5 from '@/app/components/icons/Icon_right5'

const PublicNavigationMenu = () => {
  return (
    <div
      className={
        'pb-10 pt-10 md:pb-[38px] md:pt-[38px] bg-gradient-to-r from-[#2F8EDD] via-[#2F9DDD] to-[#2FBADD]'
      }
    >
      <div
        className={
          'max-w-[1326px] mx-auto md:px-6 lg:px-10 xl:px-0 flex justify-between items-center text-white relative'
        }
      >
        <div className={'w-fit'}>
          <Link href={'/'}>
            <Image src={ltLogo} alt="Love Transfusion logo" quality={100} />
          </Link>
        </div>
        <Image
          src={heartbeat}
          alt="heartbeat"
          quality={100}
          className="absolute top-0 bottom-0 right-0 left-0 m-auto"
        />
        <div className={'flex gap-4 items-center'}>
          <div
            className={
              'flex divide-x divide-white h-4 items-center overflow-y-hidden font-acuminProExtraLight text-[15px]'
            }
          >
            <Link href={'/about-us'}>
              <p className={'px-[10px]'}>About Us</p>
            </Link>
            <Link href={'/help-center'}>
              <p className={'px-[10px]'}>FAQ</p>
            </Link>
            <Link href={'/contact-us'}>
              <p className={'px-[10px]'}>Contact Us</p>
            </Link>
          </div>
          <Link href={'/login'}>
            <Button
              clVariant="outlined"
              className="border-2 rounded-[4px] flex py-1 shadow-[0_0_12px_0_#288ccc45] pr-2"
            >
              <div
                className={
                  'flex items-center divide-x divide-white divide-opacity-50'
                }
              >
                <p className={'px-4 mr-4 text-sm font-acuminProRegular'}>
                  Login
                </p>
                <div className={'pl-2'}>
                  <Icon_right5 className="size-[12px]" />
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
