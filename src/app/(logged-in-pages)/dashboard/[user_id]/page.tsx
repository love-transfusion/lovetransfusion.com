import React, { Suspense } from 'react'
import SlidingSupportersName from './SlidingSupportersName'
const MapChart = dynamic(() => import('./MapChart'))
import RecipientProfilePicture from './RecipientProfilePicture'
import arrow from './images/arrow.png'
import Image from 'next/image'
import MostRecentEngagements from './MostRecentEngagements'
import HugsMessagesShares from './HugsMessagesShares'
import TotalEngagements from './TotalEngagements'
import WelcomeMessage from './WelcomeMessage'
import { supa_select_recipient } from './actions'
import MessagesSection from './MessagesSection'
import { ga_selectGoogleAnalyticsData } from '@/app/utilities/analytics/googleAnalytics'
import getAnalyticsCountryPathTotal from '@/app/utilities/analytics/getAnalyticsCountryPathTotal'
import { mapAnalyticsToGeoPoints } from '@/app/utilities/analytics/mapAnalyticsToGeoPoints'
import LoadingComponent from '@/app/components/Loading'
import dynamic from 'next/dynamic'

type Params = Promise<{ user_id: string }>
const DashboardPage = async (props: { params: Params }) => {
  const { user_id } = await props.params
  const { data: recipientRow } = await supa_select_recipient(user_id)

  const unkRecipientObj = recipientRow?.recipient as unknown
  const recipientObj =
    unkRecipientObj as I_supaorg_recipient_hugs_counters_comments

  const clGoogleAnalytics = await ga_selectGoogleAnalyticsData({
    clSpecificPath: `/${recipientObj.path_url}`,
  })

  if (!recipientRow) return

  const analyticsWithCountryPathTotal = await getAnalyticsCountryPathTotal({
    clGoogleAnalytics,
    clRecipient: recipientObj,
  })
  const mappedData =
    analyticsWithCountryPathTotal &&
    (await mapAnalyticsToGeoPoints(analyticsWithCountryPathTotal))

  return (
    <div className="">
      <WelcomeMessage />
      <SlidingSupportersName />
      {/* Profile and Map Section */}
      <div
        className={
          'flex flex-wrap xl:flex-nowrap gap-5 xl:gap-0 pt-[30px] xl:pt-[46px] pb-8 md:pb-[38px] xl:pb-[50px] pl-0 md:pl-10 2xl:pl-[45px] pr-0 md:pr-[34px] 2xl:pr-[30px] border-b-4 border-[#B0E0F1]'
        }
      >
        <div
          className={
            'max-sm:flex max-sm:justify-center max-sm:flex-wrap max-sm:items-center max-sm:gap-5 min-w-[208px] pt-4 xl:pt-[unset] max-sm:w-full max-sm:px-4'
          }
        >
          <RecipientProfilePicture recipientObj={recipientObj} />
          <div className={'mt-2 text-left md:text-center'}>
            <p
              className={
                'font-acuminProSemibold text-[22px] md:text-[26px] text-primary'
              }
            >
              {recipientObj.first_name}
            </p>
            <p className={'text-primary-200 md:text-xl'}>RECIPIENT</p>
          </div>
          <div className={'hidden relative md:flex flex-col items-end h-fit'}>
            <TotalEngagements clRecipientOBj={recipientObj} />
            <Image
              src={arrow}
              alt="arrow"
              quality={100}
              className=" max-sm:hidden absolute top-4 left-[79px] my-auto"
            />
          </div>
        </div>
        <div
          className={
            'w-full md:max-w-[445px] lg:max-w-[695px] xl:max-w-full max-sm:pt-5 lg:pt-[10px] 2xl:pt-[26px]'
          }
        >
          <Suspense
            fallback={
              <LoadingComponent clContainerClassName="h-[170px] md:h-[370px]" />
            }
          >
            <MapChart mappedData={mappedData} />
          </Suspense>
          <div className={'hidden xl:block'}>
            <HugsMessagesShares clRecipientObj={recipientObj} />
          </div>
        </div>
        <div className={'mx-auto max-sm:w-full'}>
          <div className={'xl:hidden'}>
            <HugsMessagesShares clRecipientObj={recipientObj} />
          </div>
          <MostRecentEngagements clRecipientOBj={recipientObj} />
        </div>
      </div>
      {/* Messages Section */}
      <MessagesSection clRecipientObj={recipientObj} />
    </div>
  )
}

export default DashboardPage
