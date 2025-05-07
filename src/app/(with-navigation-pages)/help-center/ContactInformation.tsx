import Icon_facebook2 from '@/app/components/icons/Icon_facebook2'
import Icon_instagram from '@/app/components/icons/Icon_instagram'
import Icon_linkedin2 from '@/app/components/icons/Icon_linkedin2'
import Icon_pinterest from '@/app/components/icons/Icon_pinterest'
import Icon_twitterX from '@/app/components/icons/Icon_twitterX'
import Icon_youtube from '@/app/components/icons/Icon_youtube'
import Link from 'next/link'
import React from 'react'
import ltLogoColored from '@/app/images/logo-colored.svg'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

interface I_ContactInformation {
  clDisableHelpCenter?: boolean
  clLabelsClassName?: string
  cl501ClassName?: string
  clUrlClassName?: string
}

const ContactInformation = ({
  clDisableHelpCenter = false,
  clLabelsClassName,
  cl501ClassName,
  clUrlClassName,
}: I_ContactInformation) => {
  return (
    <div className={'flex flex-col w-full'}>
      {!clDisableHelpCenter && (
        <p
          className={
            'font-acumin-variable-68 font-bold text-[#b3d8f3] text-[30px] mb-4 leading-tight -mt-[1px]'
          }
        >
          HELP CENTER
        </p>
      )}
      <Image src={ltLogoColored} alt="Love Transfusion logo" quality={100} />
      <p
        className={
          'font-acumin-variable-68 font-bold text-primary text-[22px] leading-tight mt-[15px]'
        }
      >
        Love Transfusion Inc.
      </p>
      <p
        className={
          'font-acumin-variable-68 text-primary text-[20px] leading-snug'
        }
      >
        1201 N. Orange Street
        <br />
        Suite 799
        <br />
        Wilmington, DE 19801
      </p>
      <div
        className={
          'flex flex-col font-acumin-variable-68 text-primary gap-2 mt-[18px]'
        }
      >
        <div className={'flex gap-[11px] w-fit'}>
          <p
            className={twMerge(
              'md:w-[100px] text-nowrap text-right',
              clLabelsClassName
            )}
          >
            Website:
          </p>
          <Link
            href={'https://www.lovetransfusion.org/'}
            className="text-white bg-primary rounded-md"
          >
            <p className={twMerge('text-sm rounded-md px-2', clUrlClassName)}>
              LoveTransfusion.org
            </p>
          </Link>
        </div>
        <div className={'flex gap-[11px] w-fit'}>
          <p
            className={twMerge(
              'md:w-[100px] text-nowrap text-right',
              clLabelsClassName
            )}
          >
            Recipient App:
          </p>
          <Link
            href={'https://lovetransfusion.com/'}
            className="rounded-md border-primary border"
          >
            <p className={twMerge('text-sm px-2', clUrlClassName)}>
              LoveTransfusion.com
            </p>
          </Link>
        </div>
        <div className={'flex gap-1 md:gap-2 w-fit'}>
          <p
            className={twMerge(
              'md:w-[100px] text-nowrap text-right',
              clLabelsClassName
            )}
          >
            Social Media:
          </p>
          <Link
            target="_blank"
            href={'https://www.facebook.com/LoveTransfusion'}
          >
            <div className={'flex gap-2'}>
              <div
                className={
                  'size-[30px] relative rounded-full border border-primary'
                }
              >
                <Icon_facebook2 className="absolute top-0 bottom-0 right-0 left-0 m-auto" />
              </div>
            </div>
          </Link>
          <Link
            target="_blank"
            href={'https://www.instagram.com/lovetransfusion/'}
          >
            <div className={'flex gap-2'}>
              <div
                className={
                  'size-[30px] relative rounded-full border border-primary'
                }
              >
                <Icon_instagram className="absolute top-0 bottom-0 right-0 left-0 m-auto" />
              </div>
            </div>
          </Link>
          <Link target="_blank" href={'https://twitter.com/LoveTransfusion'}>
            <div className={'flex gap-2'}>
              <div
                className={
                  'size-[30px] relative rounded-full border border-primary'
                }
              >
                <Icon_twitterX className="absolute top-0 bottom-0 right-0 left-0 m-auto" />
              </div>
            </div>
          </Link>
          <Link
            target="_blank"
            href={'https://www.pinterest.com/lovetransfusion/'}
          >
            <div className={'flex gap-2'}>
              <div
                className={
                  'size-[30px] relative rounded-full border border-primary'
                }
              >
                <Icon_pinterest className="absolute top-0 bottom-0 right-0 left-0 m-auto" />
              </div>
            </div>
          </Link>
          <Link
            target="_blank"
            href={'https://www.youtube.com/lovetransfusion'}
          >
            <div className={'flex gap-2'}>
              <div
                className={
                  'size-[30px] relative rounded-full border border-primary'
                }
              >
                <Icon_youtube className="absolute top-0 bottom-0 right-0 left-0 m-auto" />
              </div>
            </div>
          </Link>
          <Link
            target="_blank"
            href={'https://www.linkedin.com/company/1437472/admin/dashboard/'}
          >
            <div className={'flex gap-2'}>
              <div
                className={
                  'size-[30px] relative rounded-full border border-primary'
                }
              >
                <Icon_linkedin2 className="absolute top-0 bottom-0 right-0 left-0 m-auto size-5" />
              </div>
            </div>
          </Link>
        </div>
      </div>
      <p
        className={twMerge(
          'font-acumin-variable-68 text-primary mt-[5px]',
          cl501ClassName
        )}
      >
        501(c)3 Nonprofit Organization | Tax ID #27-2829895
      </p>
    </div>
  )
}

export default ContactInformation
