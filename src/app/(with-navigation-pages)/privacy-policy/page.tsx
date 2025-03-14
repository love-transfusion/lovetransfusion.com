import React from 'react'
import files from './images/files.svg'
import Image from 'next/image'
import Link from 'next/link'

const PrivacyPage = () => {
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
          Privacy Policy
        </p>
        <div className={'text-[#999] flex flex-col gap-4'}>
          <p
            className={''}
          >{`Love Transfusion Inc. ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you use the Love Transfusion App ("the App"). By accessing or using the App, you agree to this Privacy Policy. If you do not agree, please do not use the App.`}</p>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              1. Information We Collect
            </p>
            <p className={''}>
              We collect the following types of information when you use the
              App:
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              a. Personal Information
            </p>
            <p className={''}>
              When you create an account, submit a story, or use certain
              features of the App, we collect personal information that may
              include your name, email address, phone number, mailing address,
              and any other information you provide.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              b. Information About Recipients
            </p>
            <p className={''}>
              If you are submitting a story about a recipient (such as a child
              or disabled person), we may collect information about them, such
              as their name, age, and health condition. We ask that you obtain
              consent from the recipient or their legal guardian before
              submitting any such information.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              c. Usage Data
            </p>
            <p className={''}>
              We automatically collect information about how you use the App,
              such as IP address, device type, browser type, operating system,
              and browsing actions. We also collect data about the content you
              view, such as stories and messages of support.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              2. How We Use Your Information
            </p>
            <p className={''}>
              We may use the information we collect for the following purposes:
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <ul className="space-y-2 pl-2">
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Account Management:{' '}
                </span>
                To create and manage your account, verify your identity, and
                provide you access to the App.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Service Provision:{' '}
                </span>
                To provide, maintain, and improve the functionality of the App,
                including facilitating support messages to recipients.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Communication:{' '}
                </span>
                To send you notifications, updates, and other communications
                regarding the App and your account.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Personalization:{' '}
                </span>
                To customize your experience and show you content tailored to
                your interests.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Analytics:{' '}
                </span>
                To analyze trends, usage, and activities in connection with the
                App to improve the user experience.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Legal Compliance:{' '}
                </span>
                To comply with applicable laws, regulations, or legal
                obligations.
              </li>
            </ul>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              3. Sharing Your Information
            </p>
            <p className={''}>
              We do not sell or rent your personal information to third parties.
              However, we may share your information with third parties in the
              following circumstances:
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <ul className="space-y-2 pl-2">
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Service Providers:{' '}
                </span>
                We may share your information with trusted service providers who
                assist us in operating the App, such as hosting providers, email
                services, and payment processors. These third parties are bound
                by confidentiality agreements and are only permitted to use your
                information for specified purposes.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Legal Requirements:{' '}
                </span>
                We may disclose your information if required to do so by law or
                in response to valid requests from public authorities (e.g.,
                courts or government agencies).
              </li>
            </ul>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              4. Data Security
            </p>
            <p className={''}>
              We take the security of your personal information seriously and
              use industry-standard security measures to protect your data.
              However, no method of transmission over the internet or method of
              electronic storage is completely secure, and we cannot guarantee
              the absolute security of your information.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              {`5. Children's Privacy`}
            </p>
            <p className={''}>
              {`We understand the importance of protecting children's privacy.
              While parents or guardians may set up accounts on behalf of
              children under 18, the App is not intended for use by children
              without supervision. We encourage parents and guardians to monitor
              their child's use of the App and ensure the child’s privacy is
              protected.`}
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              6. Your Choices
            </p>
            <p className={''}>
              You have the following choices regarding your information:
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <ul className="space-y-2 pl-2">
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Service Providers:{' '}
                </span>
                We may share your information with trusted service providers who
                assist us in operating the App, such as hosting providers, email
                services, and payment processors. These third parties are bound
                by confidentiality agreements and are only permitted to use your
                information for specified purposes.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Access and Update:{' '}
                </span>
                You may access and update your account information by logging
                into the App or contacting us at
                lovesupport@lovetransfusion.org.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Delete Account:{' '}
                </span>
                You may request the deletion of your account and personal
                information by contacting us at lovesupport@lovetransfusion.org.
                Please note that certain information may be retained for legal
                or business purposes.
              </li>
              <li className="before:content-['■'] before:text-primary before:absolute before:-left-[10px] relative">
                <span className="font-acuminProSemibold text-primary">
                  Opt-Out of Communications:{' '}
                </span>
                You may opt out of receiving promotional emails from us by
                following the instructions in those emails. You may also adjust
                your notification settings within the App.
              </li>
            </ul>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              7. Third-Party Links
            </p>
            <p className={''}>
              The App may contain links to third-party websites or services that
              are not operated by us. This Privacy Policy does not apply to
              those third-party services. We encourage you to review the privacy
              policies of any third-party websites you visit.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              8. International Users
            </p>
            <p className={''}>
              If you are accessing the App from outside the United States,
              please be aware that your information may be transferred to and
              processed in the United States, where data protection laws may
              differ from those of your country. By using the App, you consent
              to the transfer and processing of your information in the United
              States.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              9. Changes to This Privacy Policy
            </p>
            <p className={''}>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. If we make significant changes, we will notify
              you through the App or via email. Your continued use of the App
              after any changes to the Privacy Policy will constitute your
              acceptance of those changes.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              10. Contact Us
            </p>
            <p className={''}>
              If you have any questions about this Privacy Policy, please
              contact us at{' '}
              <Link href={'mailto:lovesupport@lovetransfusion.org'}>
                lovesupport@lovetransfusion.org
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
