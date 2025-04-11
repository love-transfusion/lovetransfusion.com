import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Icon_facebook2 from '../../icons/Icon_facebook2'
import Icon_instagram from '../../icons/Icon_instagram'
import Icon_twitterX from '../../icons/Icon_twitterX'
import Icon_pinterest from '../../icons/Icon_pinterest'
import webIcon from '@/app/images/footer-images/Website.svg'
import footerLogo from '@/app/images/footer-logo.svg'

const PublicFooter = () => {
  return (
    <div
      className={
        'pb-10 pt-10 md:pb-[21px] md:pt-10 bg-primary text-white font-extralight text-sm md:text-base px-4 lg:px-0'
      }
    >
      <div className={'max-w-[1104px] mx-auto md:px-6 lg:px-10 xl:px-0 '}>
        <div className={'w-fit mx-auto'}>
          <Link href={'/'} className="">
            <Image
              src={footerLogo}
              alt="Love Transfusion Logo"
              quality={100}
              width={353}
              height={43}
              className="w-[353px] h-[65px]"
            />
          </Link>
        </div>
        <p className={'text-center mt-[7px] text-lg'}>
          1201 N. Orange Street, Suite 799, <br className="block md:hidden" />
          Wilmington DE 19801
        </p>
        <p className={'text-center mt-[2px]'}>
          501(c)3 Nonprofit Organization | Tax ID #27-2829895
        </p>
        <p className={'mt-2 md:mt-[28px] text-center'}>
          <Link href={'/about-us'}>About Us</Link> |{' '}
          <Link href={'/help-center'}>FAQ</Link> |{' '}
          <Link href={'/contact-us'}>Contact Us</Link> |{' '}
          <Link href={'/terms-of-use'}>Terms of Use</Link> |{' '}
          <Link href={'/privacy-policy'}>Privacy Policy</Link>
        </p>
        <div
          className={
            'flex flex-col lg:flex-row justify-between items-center mt-4 md:mt-10 gap-4'
          }
        >
          <p className={''}>
            © 2010-{new Date().getFullYear()} Love Transfusion Inc. All Rights
            Reserved.
          </p>
          <div className={'flex gap-4 justify-center md:justify-start'}>
            <Link href={'https://www.lovetransfusion.org/'} target="_blank">
              <Image
                src={webIcon}
                alt="web icon"
                quality={100}
                className="w-[30px] h-[30px]"
              />
            </Link>
            <Link
              href={'https://www.facebook.com/LoveTransfusion'}
              target="_blank"
            >
              <div
                className={
                  'w-[30px] h-[30px] border rounded-full border-white relative'
                }
              >
                <Icon_facebook2 className="absolute bottom-0 right-0 left-0 m-auto size-6" />
              </div>
            </Link>
            <Link
              href={'https://www.instagram.com/lovetransfusion/'}
              target="_blank"
            >
              <div
                className={
                  'w-[30px] h-[30px] border rounded-full border-white relative'
                }
              >
                <Icon_instagram className="absolute top-0 bottom-0 right-0 left-0 m-auto size-6" />
              </div>
            </Link>
            <Link href={'https://twitter.com/LoveTransfusion'} target="_blank">
              <div
                className={
                  'w-[30px] h-[30px] border rounded-full border-white relative'
                }
              >
                <Icon_twitterX className="absolute top-0 bottom-0 right-0 left-0 m-auto" />
              </div>
            </Link>
            <Link
              href={'https://www.pinterest.com/lovetransfusion/'}
              target="_blank"
            >
              <div
                className={
                  'w-[30px] h-[30px] border rounded-full border-white relative'
                }
              >
                <Icon_pinterest className="absolute top-0 bottom-0 right-0 left-0 m-auto" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicFooter
