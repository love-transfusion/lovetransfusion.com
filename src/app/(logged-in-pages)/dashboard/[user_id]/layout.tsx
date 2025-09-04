import React from 'react'
import SlidingSupportersName from './SlidingSupportersName'
import RecipientProfilePicture from './RecipientProfilePicture'
import arrow from './images/arrow.png'
import Image from 'next/image'
import HugsMessagesShares, { I_fb_comments_Types } from './HugsMessagesShares'
import TotalEngagements from './TotalEngagements'
import WelcomeMessage from './WelcomeMessage'
import { filter_comments } from './actions'
import MessagesSection from './MessagesSection'
import { supa_select_user } from '@/app/_actions/users/actions'
import { AdWiseInsight } from '@/app/utilities/facebook/util_fb_insights'
import ErrorMessage from './ErrorMessage'
import MostRecentEngagements from './MostRecentEngagements'
import MostRecentEngagementContainer from './MostRecentEngagementContainer'
import { Metadata } from 'next'
import { I_Comments } from '@/types/Comments.types'

type Params = Promise<{ user_id: string }>

interface I_userDashboardLayout extends Params {
  map: React.ReactNode
  updateSlot: React.ReactNode
  params: Params
}

export const maxDuration = 60

const title = 'Emotional Support Dashboard'
const description =
  'In just seconds, you can send a powerful expression of love and support to someone who needs it most.'
const url = 'https://www.lovetransfusion.com/dashboard' // This should be present in other pages like /submit-story

export const metadata: Metadata = {
  title,
  description,

  // OpenGraph metadata
  openGraph: {
    title,
    description,
    url,
  },

  // Twitter/X Card metadata
  twitter: {
    title: title,
  },
}

const UserDashboardLayout = async (props: I_userDashboardLayout) => {
  const { user_id } = await props.params
  const { updateSlot, map } = props

  const [{ data: selectedUser }] = await Promise.all([
    supa_select_user(user_id),
  ])

  if (!selectedUser) return

  const unknown_selectedRecipient = selectedUser.users_data_website[0]
    .recipient as unknown
  const selectedRecipient =
    unknown_selectedRecipient as I_supaorg_recipient_hugs_counters_comments

  const FBComments = selectedUser.users_data_facebook?.comments as
    | I_fb_comments_Types[]
    | undefined

  const formattedFBComments: I_Comments[] =
    FBComments?.map((item) => {
      return {
        type: 'facebook',
        id: item.id,
        name: item.from?.name ?? 'Someone Who Cares',
        message: item.message ?? 'Empty',
        created_at: item.created_time,
      }
    }) ?? []

  const formattedWebsiteComments: I_Comments[] = selectedRecipient.comments.map(
    (item) => {
      return {
        type: 'website',
        id: item.id,
        name: item.name ?? 'Someone Who Cares',
        message: item.comment ?? 'Empty',
        created_at: item.created_at,
        profile_picture_website: item.public_profiles,
      }
    }
  )

  const formattedWebsiteHugs: I_Comments[] = selectedRecipient.hugs.map(
    (item) => {
      return {
        type: 'website',
        id: item.id,
        name:
          (item.public_profiles?.full_name &&
            item.public_profiles?.full_name) ||
          (item.public_profiles?.first_name &&
            `${item.public_profiles?.first_name} ${item.public_profiles?.last_name}`) ||
          'Someone Who Cares',
        message: 'Empty',
        created_at: item.created_at,
        profile_picture_website: item.public_profiles,
      }
    }
  )

  const fbInsights = selectedUser.users_data_facebook?.insights
    ? (selectedUser.users_data_facebook.insights as [] | AdWiseInsight[])
    : []

  const allComments = await filter_comments(
    [...formattedWebsiteComments, ...formattedFBComments],
    selectedUser.receipients_deleted_messages
  )

  const allEngagements = await filter_comments(
    [
      ...formattedFBComments,
      ...formattedWebsiteComments,
      ...formattedWebsiteHugs,
    ],
    selectedUser.receipients_deleted_messages
  )

  return (
    <div className="">
      <ErrorMessage />
      <WelcomeMessage selectedUser={selectedUser} />
      <SlidingSupportersName clRecipient={selectedRecipient} />
      {/* Profile and Map Section */}
      <div
        className={
          'flex flex-wrap xl:flex-nowrap gap-2 md:gap-5 xl:gap-0 pt-[30px] xl:pt-[53px] pb-8 md:pb-[38px] xl:pb-[50px] pl-0 md:pl-10 2xl:pl-[59px] pr-0 md:pr-[34px] 2xl:pr-[49px] border-b-4 border-[#B0E0F1]'
        }
      >
        <div
          className={
            'max-sm:flex max-sm:justify-center max-sm:flex-wrap max-sm:items-center max-sm:gap-7 min-w-[208px] pt-4 xl:pt-[unset] max-sm:w-full max-sm:px-4'
          }
        >
          <RecipientProfilePicture
            recipientObj={selectedRecipient}
            selectedUser={selectedUser}
          />
          <div className={'mt-2 text-left md:text-center -ml-[9px]'}>
            <p
              className={
                'font-acumin-variable-90 text-[28px] md:text-[26px] text-primary capitalize font-semibold pt-1'
              }
            >
              {selectedUser?.recipient_name}
            </p>
            <p
              className={
                'text-primary-200 text-xl md:text-xl font font-acumin-variable-90'
              }
            >
              RECIPIENT
            </p>
          </div>
          <div className={'hidden relative md:flex flex-col items-end h-fit'}>
            <TotalEngagements
              selectedUser={selectedUser}
              fbInsights={fbInsights}
              users_data_facebook={selectedUser.users_data_facebook}
            />
            <Image
              src={arrow}
              alt="arrow"
              quality={100}
              className=" max-sm:hidden absolute top-[9px] left-[64px] my-auto min-w-[260px]"
            />
          </div>
        </div>
        <div
          className={
            'w-full md:max-w-[445px] lg:max-w-[695px] xl:max-w-full max-sm:pt-5 lg:pt-[10px] xl:pt-[26px]'
          }
        >
          {map}
          <div className={'hidden xl:block'}>
            <HugsMessagesShares
              selectedUser={selectedUser}
              users_data_facebook={selectedUser.users_data_facebook}
              fbInsights={fbInsights}
            />
          </div>
        </div>
        <div className={'mx-auto max-sm:w-full md:mt-10 xl:mt-0'}>
          <div className={'xl:hidden'}>
            <HugsMessagesShares
              selectedUser={selectedUser}
              users_data_facebook={selectedUser.users_data_facebook}
              fbInsights={fbInsights}
            />
          </div>
          <MostRecentEngagementContainer user_id={user_id}>
            <MostRecentEngagements allEngagements={allEngagements} />
          </MostRecentEngagementContainer>
        </div>
      </div>
      {/* Messages Section */}
      <MessagesSection
        clUser_id={user_id}
        clComments={allComments}
        selectedUser={selectedUser}
      />
      {updateSlot}
    </div>
  )
}

export default UserDashboardLayout
