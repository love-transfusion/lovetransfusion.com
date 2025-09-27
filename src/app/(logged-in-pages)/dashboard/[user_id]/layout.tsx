import React from 'react'
import SlidingSupportersName from './SlidingSupportersName'
import RecipientProfilePicture from './RecipientProfilePicture'
import arrow from './images/arrow.png'
import Image from 'next/image'
import HugsMessagesShares from './HugsMessagesShares'
import TotalEngagements from './TotalEngagements'
import WelcomeMessage from './WelcomeMessage'
import { filter_deleted_comments } from './actions'
import { supa_select_user } from '@/app/_actions/users/actions'
import ErrorMessage from './ErrorMessage'
import MostRecentEngagements from './MostRecentEngagements'
import MostRecentEngagementContainer from './MostRecentEngagementContainer'
import { Metadata } from 'next'
import { I_Comments } from '@/types/Comments.types'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'
import { AdWiseInsight } from '@/app/utilities/facebook/util_fb_insights'
import { supa_select_facebook_comments } from '@/app/_actions/facebook_comments/actions'

interface I_userDashboardLayout {
  map: React.ReactNode
  updateSlot: React.ReactNode
  messageSection: React.ReactNode
  params: Promise<{ user_id: string }>
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
  const { updateSlot, map, messageSection } = props

  const [{ data: selectedUser }] = await Promise.all([
    supa_select_user(user_id),
  ])

  if (!selectedUser) return

  const { data: FBComments, count: commentsCount } =
    await supa_select_facebook_comments({
      clCurrentPage: 1,
      clLimit: 100,
      post_id:
        selectedUser.facebook_posts && !!selectedUser.facebook_posts.length
          ? selectedUser.facebook_posts[0].post_id
          : undefined,
    })

  const unknown_selectedRecipient =
    selectedUser.recipients &&
    selectedUser.recipients.length &&
    (selectedUser.recipients[0].recipient as unknown)
  const selectedRecipient = unknown_selectedRecipient as
    | I_supaorg_recipient
    | undefined

  if (!selectedRecipient)
    throw new Error('No recipient linked to this account.')

  const formattedFBComments: I_Comments[] = FBComments?.filter(
    (item) => !item.is_deleted
  )?.map((item) => {
    return {
      type: 'facebook',
      id: item.comment_id,
      name: item.from_name ?? 'Someone Who Cares',
      message: item.message ?? 'Empty',
      created_at: item.created_time,
      profile_picture: item.from_picture_url,
    }
  })

  const formattedWebsiteComments: I_Comments[] | null =
    selectedRecipient.comments.map((item) => {
      return {
        type: 'website',
        id: item.id,
        name: item.name ?? 'Someone Who Cares',
        message: item.comment ?? 'Empty',
        created_at: item.created_at,
        profile_picture_website: item.public_profiles,
      }
    })

  const formattedWebsiteHugs: I_Comments[] | null = selectedRecipient.hugs.map(
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

  const unknown_fbInsights = !!selectedUser.facebook_insights?.length
    ? (selectedUser.facebook_insights[0].insights as unknown)
    : []

  const fbInsights = unknown_fbInsights as AdWiseInsight[]

  const allEngagements = await filter_deleted_comments(
    [
      ...formattedFBComments,
      ...(formattedWebsiteComments ?? []),
      ...(formattedWebsiteHugs ?? []),
    ],
    selectedUser.receipients_deleted_messages
  )

  const fbShareCount = !!selectedUser.facebook_insights?.length
    ? selectedUser.facebook_insights[0].shares
    : 0
  return (
    <div className="">
      <ErrorMessage />
      <WelcomeMessage selectedUser={selectedUser} />
      <SlidingSupportersName
        clRecipient={selectedRecipient}
        formattedFBComments={formattedFBComments}
      />
      {/* Profile and Map Section */}
      <div
        className={
          'flex flex-wrap xl:flex-nowrap gap-2 md:gap-5 xl:gap-0 pt-[30px] xl:pt-[53px] pb-8 md:pb-[38px] xl:pb-[50px] pl-0 md:pl-10 xl:pl-6 2xl:pl-[59px] pr-0 md:pr-[34px] xl:pr-2 2xl:pr-[49px] border-b-4 border-[#B0E0F1]'
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
              recipient={selectedRecipient}
              fbInsights={fbInsights}
              commentsCount={commentsCount}
              fbShareCount={fbShareCount}
            />
            <Image
              src={arrow}
              alt="arrow"
              quality={100}
              className=" max-sm:hidden absolute top-[9px] xl:top-2 2xl:top-[9px] left-[64px] my-auto min-w-[260px] xl:min-w-[220px] 2xl:min-w-[260px]"
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
              recipient={selectedRecipient}
              fbInsights={fbInsights}
              commentsCount={commentsCount}
              fbShareCount={fbShareCount}
            />
          </div>
        </div>
        <div className={'mx-auto max-sm:w-full md:mt-10 xl:mt-0'}>
          <div className={'xl:hidden'}>
            <HugsMessagesShares
              recipient={selectedRecipient}
              fbInsights={fbInsights}
              commentsCount={commentsCount}
              fbShareCount={fbShareCount}
            />
          </div>
          <MostRecentEngagementContainer user_id={user_id}>
            <MostRecentEngagements allEngagements={allEngagements} />
          </MostRecentEngagementContainer>
        </div>
      </div>
      {/* Messages Section */}
      {messageSection}
      {updateSlot}
    </div>
  )
}

export default UserDashboardLayout
