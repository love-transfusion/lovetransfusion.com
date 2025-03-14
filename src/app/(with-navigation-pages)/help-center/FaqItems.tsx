import FAQItem from '@/app/components/faq/FAQItem'
import Link from 'next/link'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface I_FaqItems {
  clContainerClassName?: string
}

const FaqItems = ({ clContainerClassName }: I_FaqItems) => {
  return (
    <div
      className={twMerge(
        'mt-10 flex flex-col gap-4 px-4',
        clContainerClassName
      )}
    >
      <FAQItem
        clTitle="What is the Love Transfusion App?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            Love Transfusion facilitates support and raises awareness of
            recipient’s stories by sharing them on social media and
            LoveTransfusion.org. The Love Transfusion App is an emotional
            support platform that displays expressions of love and support that
            are sent to recipients from people who see the recipients’ story. It
            allows the recipient and their family to view supportive messages in
            one safe and convenient place.
          </p>
        }
      />
      <FAQItem
        clTitle="Who can use the Love Transfusion App?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            The app is available to recipients of Love Transfusion support or
            their designated guardians. A parent or guardian can create an
            account for a child by submitting their story through{' '}
            <Link
              href={'https://www.lovetransfusion.org/submit-story'}
              target="_blank"
            >
              LoveTransfusion.org
            </Link>
            . Later, the child can log in to view the messages.
          </p>
        }
      />
      <FAQItem
        clTitle="How does the app gather and display social media engagements?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            The app pulls engagement data from social media platforms like
            Facebook, Instagram, X (formerly Twitter), Pinterest, and
            LoveTransfusion.org via API. It compiles expressions of love and
            support from those sources into one dashboard so you can see all the
            support in one place.
          </p>
        }
      />
      <FAQItem
        clTitle="Why do some Love Transfusions not show a name or profile picture?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            Some platforms, due to privacy restrictions, do not allow us to
            display the profile pictures or names of those engaging with your
            story. In these cases, a placeholder picture and generic name (like
            “Facebook User”) is shown. Rest assured; these are all genuine
            expressions of support from real people.
          </p>
        }
      />
      <FAQItem
        clTitle="How do I create an account for my child or someone I care for?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            Parents or guardians can create an account and set up a profile for
            a child or another person by submitting their story through{' '}
            <Link
              href={'https://www.lovetransfusion.org/submit-story'}
              target="_blank"
            >
              LoveTransfusion.org
            </Link>
            . Once the application is approved, the recipient can view the
            messages of support by logging into their account.
          </p>
        }
      />
      <FAQItem
        clTitle="Why do some Love Transfusions not show a name or profile picture?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            Some platforms, due to privacy restrictions, do not allow us to
            display the profile pictures or names of those engaging with your
            story. In these cases, a placeholder picture and generic name (like
            “Facebook User”) is shown. Rest assured; these are all genuine
            expressions of support from real people.
          </p>
        }
      />
      <FAQItem
        clTitle="How do I create an account for my child or someone I care for?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            Parents or guardians can create an account and set up a profile for
            a child or another person by submitting their story through
            LoveTransfusion.org (link:
            https://www.lovetransfusion.org/submitstory). Once the application
            is approved, the recipient can view the messages of support by
            logging into their account.
          </p>
        }
      />
      <FAQItem
        clTitle="Is personal information secure in the app?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            Yes, all personal information is securely stored and used only to
            enhance the support experience. The app uses encrypted connections
            and follows strict data protection standards.
          </p>
        }
      />
      <FAQItem
        clTitle="How often is the engagement data updated?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            The app continuously updates engagement data from social media and
            LoveTransfusion.org, ensuring you can see new likes, comments, and
            shares as they happen.
          </p>
        }
      />
      <FAQItem
        clTitle="What should I do if I experience issues with the app?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            {`If you encounter any issues, you can contact our support team via the app's contact section or email us at lovesupport@lovetransfusion.org.`}
          </p>
        }
      />
      <FAQItem
        clTitle="Can supporters interact directly with me through the app?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            Supporters can engage through public social media posts or
            LoveTransfusion.org. For safety and privacy, direct messaging is not
            available in the app itself.
          </p>
        }
      />
      <FAQItem
        clTitle="Is the app safe for children?"
        clContent={
          <p className={'text-[#999] text-lg'}>
            Yes, the app is designed to be a safe, positive space. Comments on
            social media are filtered or manually flagged, and you can hide any
            comment directly from your dashboard if needed.
          </p>
        }
      />
    </div>
  )
}

export default FaqItems
