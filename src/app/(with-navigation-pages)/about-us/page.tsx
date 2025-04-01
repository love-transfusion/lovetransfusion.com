import React from 'react'
import ltLogo from './images/about-us.webp'
import Image from 'next/image'

const AboutUsPage = () => {
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
          <Image src={ltLogo} alt="Love Transfusion Logo" quality={100} />
        </div>
        <p
          className={
            'font-acumin-condensed text-[23px] text-primary text-center mt-[14px] mb-[22px]'
          }
        >
          About Us
        </p>
        <div className={'text-[#999] flex flex-col gap-4'}>
          <p className={''}>
            At Love Transfusion, we believe in the power of connection,
            compassion, and community. As the first organization dedicated to
            facilitating emotional support—a concept supported by numerous
            medical studies—we are on a mission to ensure no one faces life’s
            most difficult challenges alone. Since 2010, our global community of
            over 100,000 compassionate individuals has become a beacon of hope
            for those in need. We are proud to be a registered 501(c)(3)
            nonprofit organization, committed to creating meaningful, lasting
            impact.
          </p>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              About This App
            </p>
            <p className={''}>
              Born out of our mission to bridge the gap between those who are
              hurting and those who care, this app provides a lifeline of love
              and support to individuals, especially children, impacted by
              serious illness. The Love Transfusion app serves as a conduit for
              expressions of love and support from around the world. By
              consolidating engagements from social media platforms and
              LoveTransfusion.org recipient pages, we offer recipients and their
              families a private, safe, and centralized space to experience the
              support of a caring community.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>
              Why It Matters
            </p>
            <p className={''}>
              Facing a crisis is challenging for recipients and their families,
              but knowing that people care can be a tremendous source of hope
              and strength. Love Transfusion empowers recipients to feel seen,
              valued, and uplifted by creating a tangible connection to those
              rooting for their well-being.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>Our Vision</p>
            <p className={''}>
              We envision a world where technology amplifies human empathy, and
              love becomes a force for healing and transformation. With every
              like, comment, and share, we aim to build a global network of
              support for each and every recipient.
            </p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-primary font-acuminProSemibold'}>Join Us</p>
            <p className={''}>
              Love Transfusion is more than an app; it’s a movement of love and
              hope. Whether you’re a supporter, recipient, or family member, we
              invite you to explore the possibilities of what we can achieve
              together. Let’s make a difference, one heart at a time.
            </p>
          </div>
          <p className={''}>
            Thank you for being part of the Love Transfusion journey.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage
