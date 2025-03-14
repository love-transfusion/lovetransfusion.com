import React from 'react'
import files from './images/files.svg'
import Image from 'next/image'
import Link from 'next/link'

const TermsOfUsePage = () => {
  return (
    <div className={'pb-10 pt-10 lg:pb-[64px] lg:pt-[64px] px-4 lg:px-8'}>
      <div
        className={
          'max-w-[1000px] mx-auto px-4 md:px-6 lg:px-10 xl:px-8 shadow-custom2 pt-8 pb-12 rounded-lg'
        }
      >
        <div
          className={
            'bg-[#F1F5F9] size-12 flex justify-center items-center rounded-full mx-auto'
          }
        >
          <Image src={files} alt="files" quality={100} />
        </div>
        <p
          className={
            'font-acuminCondensedBold text-[23px] text-primary text-center mt-[14px] mb-[22px]'
          }
        >
          Terms of Use
        </p>
        <div className={'text-[#999] flex flex-col gap-4'}>
          <p
            className={''}
          >{`Welcome to the Love Transfusion App ("the App"), provided by Love Transfusion Inc. ("we", "us", or "our"). These Terms of Use ("Terms") govern your access to and use of the App and the services provided through the App ("Services"). By using the App, you agree to these Terms. If you do not agree to these Terms, you may not use the App.`}</p>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              1. Acceptance of Terms
            </p>
            <p className={''}>
              By accessing or using the App, you affirm that you have read,
              understood, and agree to these Terms. If you are using the App on
              behalf of an organization, other legal entity, or as a parent or
              guardian for a child or disabled person, you represent that you
              have the authority to do so and that all parties agree to be bound
              by these Terms.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              2. Eligibility
            </p>
            <p className={''}>
              {`While users must generally be at least 18 years of age to register an account, a parent or guardian may create and manage an account on behalf of a child or disabled person under their care. In such cases, the parent or guardian is responsible for supervising the child's use of the App. By allowing a child under 18 to use the App, the parent or guardian consents to these Terms on behalf of the child and agrees to monitor their activity as necessary.`}
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              3. Account Registration
            </p>
            <p className={''}>
              To access certain features of the App, you must have an account.
              You are responsible for providing accurate and up-to-date
              information when submitting a story, as this information will be
              used to set up your account. You are solely responsible for
              maintaining the confidentiality of your account credentials and
              for all activities that occur under your account.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              4. Use of the App
            </p>
            <p className={''}>
              You agree to use the App only for lawful purposes and in
              accordance with these Terms. You will not:
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <ul className="space-y-2 pl-2">
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                Post or share any content that is illegal, harmful, defamatory,
                offensive, or violates the rights of others.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                Use the App to engage in any fraudulent, deceptive, or
                misleading activities.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                Attempt to interfere with the proper functioning of the App,
                including hacking or using malicious software.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                Reproduce, distribute, or modify any part of the App without our
                prior written consent.
              </li>
            </ul>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              5. User Content
            </p>
            <p
              className={''}
            >{`You may submit or upload content such as messages of support, comments, or other materials ("User Content"). You retain ownership of your User Content but grant us a non-exclusive, royalty-free, worldwide license to use, display, modify, and distribute your User Content in connection with the Services.`}</p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={''}>
              You are solely responsible for your User Content, and you
              represent and warrant that:
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <ul className="space-y-2 pl-2">
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                You own the rights to your User Content or have the necessary
                permissions to use it.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                Your User Content does not violate any laws or third-party
                rights.
              </li>
            </ul>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              6. Privacy Policy
            </p>
            <p className={''}>
              Our{' '}
              <Link href={'/privacy-policy'} className="text-primary underline">
                Privacy Policy
              </Link>{' '}
              explains how we collect, use, and share your personal information.
              By using the App, you consent to the collection and use of your
              information as outlined in the Privacy Policy.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              7. Intellectual Property
            </p>
            <p className={''}>
              The App and all its content, features, and functionality,
              including text, images, videos, software, and trademarks, are the
              exclusive property of Love Transfusion Inc. or its licensors. You
              are granted a limited, non-exclusive, non-transferable license to
              use the App for its intended purpose.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={''}>
              You may not use any of our intellectual property without our prior
              written permission.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
            8. Termination
            </p>
            <p className={''}>
            We may suspend or terminate your access to the App at any time, for any reason, including violation of these Terms or any applicable laws. Upon termination, your right to use the App will cease immediately. You may also terminate your account at any time by contacting us at <Link href={'mailto:lovesupport@lovetransfusion.org'}>lovesupport@lovetransfusion.org</Link>.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
            9. Disclaimer of Warranties
            </p>
            <p className={''}>
            The App is provided (as is and as available,) without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the App will be error-free or uninterrupted or that any defects will be corrected.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
            10. Limitation of Liability
            </p>
            <p className={''}>
            To the maximum extent permitted by law, Love Transfusion Inc. will not be liable for any damages, including direct, indirect, incidental, consequential, or punitive damages, arising out of or related to your use or inability to use the App, even if we have been advised of the possibility of such damages.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
            11. Indemnification
            </p>
            <p className={''}>
            You agree to indemnify and hold harmless Love Transfusion Inc. and its officers, directors, employees, and agents from any claims, liabilities, damages, or expenses (including legal fees) arising out of your use of the App, your User Content, or your violation of these Terms.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
            12. Modifications to the App and Terms
            </p>
            <p className={''}>
            We reserve the right to modify, suspend, or discontinue the App or any part thereof at any time without notice. We may also update these Terms from time to time. If we make material changes, we will notify you by posting the revised Terms within the App. Your continued use of the App after the changes go into effect constitutes your acceptance of the new Terms.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
            13. Governing Law and Dispute Resolution
            </p>
            <p className={''}>
            These Terms are governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles. Any disputes arising out of or related to these Terms or the use of the App shall be resolved exclusively in the state or federal courts located in Delaware, and you consent to the personal jurisdiction of those courts.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
            14. Contact Information
            </p>
            <p className={''}>
            If you have any questions or concerns about these Terms, please contact us at <Link href={'mailto:lovesupport@lovetransfusion.org'}>lovesupport@lovetransfusion.org</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfUsePage
