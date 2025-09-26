import React from 'react'
import Link from 'next/link'

const DataDeletionPage = () => {
  return (
    <div className={'pb-10 pt-10 lg:pb-[64px] lg:pt-[64px] px-4 lg:px-8'}>
      <div
        className={
          'max-w-[1000px] mx-auto px-4 md:px-6 lg:px-10 xl:px-8 shadow-custom2 pt-8 pb-12 rounded-lg'
        }
      >
        <p
          className={
            'font-acumin-variable-68 font-bold text-[23px] text-primary text-center mt-[14px] mb-[22px]'
          }
        >
          Data Deletion Instructions
        </p>
        <div className={'text-[#999] flex flex-col gap-4'}>
          <div>
            <p className={'font-bold mb-[6px]'}>
              Data Deletion Instructions – Love Transfusion Support Platform
            </p>
            <p className={''}>
              We store only <strong>aggregated analytics</strong> and limited
              account/configuration data for our own Facebook Page. If you would
              like your data deleted, follow the steps below.
            </p>
          </div>
          <div>
            <p className={'font-bold mb-[6px]'}>How to request deletion</p>
            <p className={''}>
              Email{' '}
              <Link
                href={'mailto:support@lovetransfusion.com'}
                className="text-primary"
              >
                support@lovetransfusion.com
              </Link>{' '}
              with subject <strong>“Data Deletion Request”</strong> and include:
            </p>
            <p className={''}>1. Your name and contact email</p>
            <p className={''}>
              2. A link to your recipient/dashboard page (or recipient ID)
            </p>
            <p className={''}>
              3. What you want removed (account, photos, messages, tokens, etc.)
            </p>
          </div>
          <div>
            <p className={'font-bold mb-[6px]'}>Verification</p>
            <p className={''}>
              We may request information to verify identity or
              guardian/caregiver relationship.
            </p>
          </div>
          <div>
            <p className={'font-bold mb-[6px]'}>What we delete</p>
            <ul className="list-disc list-inside">
              <li>Account/profile and media you provided</li>
              <li>Messages you posted through our site</li>
              <li>Access tokens/credentials stored by us</li>
              <li>Logs tied to your account</li>
            </ul>
          </div>
          <div>
            <p className={'font-bold mb-[6px]'}>What we keep</p>
            <ul className="list-disc list-inside">
              <li>
                <strong>Aggregated, non-identifiable analytics</strong> (e.g.,
                total impression counts) that cannot be linked to a person
              </li>
              <li>Data we must retain for legal or abuse-prevention reasons</li>
            </ul>
            <p className={'italic'}>
              (Backups purge on their normal schedule.)
            </p>
          </div>
          <div>
            <p className={'font-bold'}>Timing</p>
            <p className={''}>
              We acknowledge within <strong>48 hours</strong> and complete
              deletion within <strong>30 days</strong>.
            </p>
          </div>
          <div>
            <p className={'font-bold'}>Third‑party platforms</p>
            <p className={''}>
              Content stored on Facebook/Instagram is governed by those
              platforms. Use their in‑product tools to remove items stored
              there.
            </p>
          </div>
          <div>
            <p className={'font-bold'}>Contact</p>
            <Link
              href={'mailto:support@lovetransfusion.com'}
              className="text-primary"
            >
              support@lovetransfusion.com
            </Link>
          </div>
          <p className={'italic'}>Last updated: September 26, 2025</p>
        </div>
      </div>
    </div>
  )
}

export default DataDeletionPage
