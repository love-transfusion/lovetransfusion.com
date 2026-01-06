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
import { supa_select_facebook_comments } from '@/app/_actions/facebook_comments/actions'
import dynamic from 'next/dynamic'
const PrayerNotification = dynamic(() => import('./PrayerNotification'), {
  ssr: true,
})

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

  const { data: FBComments, count: commentsCount } = selectedUser.facebook_posts
    ?.post_id
    ? await supa_select_facebook_comments({
        clCurrentPage: 1,
        clLimit: 100,
        post_id: selectedUser.facebook_posts.post_id,
      })
    : { data: [], count: 0 }

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
    (item) => !item.is_deleted && item.message
  )?.map((item) => {
    return {
      type: 'facebook',
      id: item.comment_id,
      name: item.from_name ?? 'Someone Who Cares',
      message: item.message,
      created_at: item.created_time,
      profile_picture: item.from_picture_url,
    }
  })
  const formattedWebsiteComments: I_Comments[] | null =
    selectedRecipient.comments
      .filter((item) => item.comment)
      .map((item) => {
        return {
          type: 'website',
          id: item.id,
          name: item.name ?? 'Someone Who Cares',
          message: item.comment,
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

  const facebook_insights = !!selectedUser.facebook_insights?.length
    ? selectedUser.facebook_insights[0]
    : null

  const allEngagements = await filter_deleted_comments(
    [
      ...formattedFBComments,
      ...(formattedWebsiteComments ?? []),
      ...(formattedWebsiteHugs ?? []),
    ],
    selectedUser.receipients_deleted_messages
  )

  return (
    <div className="">
      <ErrorMessage />
      <WelcomeMessage selectedUser={selectedUser} />
      <SlidingSupportersName
        // clRecipient={selectedRecipient}
        allEngagements={allEngagements}
      />
      {/* Profile and Map Section */}
      <div
        className={
          'flex flex-wrap xl:flex-nowrap gap-2 md:gap-5 xl:gap-0 pt-[30px] xl:pt-[53px] pb-8 md:pb-[38px] xl:pb-[50px] pl-0 md:pl-10 xl:pl-6 2xl:pl-[59px] pr-0 md:pr-[34px] xl:pr-2 2xl:pr-[49px] border-b-4 border-[#B0E0F1]'
        }
      >
        <div
          className={
            'flex md:block justify-center flex-wrap items-center gap-7 min-w-[208px] pt-4 xl:pt-[unset] w-full md:w-[unset] px-4 md:px-[unset] relative'
          }
        >
          {selectedRecipient.recipient_template === 'church' && (
            <div className="hidden md:block md:absolute md:top-4 md:-right-10 lg:top-2 lg:-right-12 xl:hidden">
              <PrayerNotification />
            </div>
          )}
          <RecipientProfilePicture
            recipientObj={selectedRecipient}
            selectedUser={selectedUser}
            sizes="(min-width: 1441px) 190px, (min-width: 768px) 120px, 135px"
            priority
          />
          <div className={'mt-2 text-left md:text-center -ml-[9px] relative'}>
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
            {selectedRecipient.recipient_template === 'church' && (
              <div className="absolute -top-8 -right-0 md:hidden">
                <PrayerNotification />
              </div>
            )}
          </div>
          <div className={'hidden relative md:flex flex-col items-end h-fit'}>
            <TotalEngagements
              recipient={selectedRecipient}
              totalReactions={facebook_insights?.total_reactions || 0}
              commentsCount={commentsCount}
              shares={facebook_insights?.shares || 0}
            />
            <Image
              src={arrow}
              alt="arrow"
              quality={100}
              className=" hidden md:block absolute top-[9px] xl:top-2 2xl:top-[9px] left-[64px] my-auto min-w-[260px] xl:min-w-[220px] 2xl:min-w-[260px]"
              priority
            />
            {selectedRecipient.recipient_template === 'church' && (
              <div className="hidden xl:block mx-auto lg:absolute -lg:top-10 lg:right-0 xl:static xl:top-[unset] xl:right-[unset] xl:mt-[220px] 2xl:mt-[260px]">
                <PrayerNotification />
              </div>
            )}
          </div>
        </div>
        <div
          className={
            'w-full md:max-w-[445px] lg:max-w-[695px] xl:max-w-full pt-5 md:pt-[unset] lg:pt-[10px] xl:pt-[26px]'
          }
        >
          {map}
          <div className={'hidden xl:block'}>
            <HugsMessagesShares
              recipient={selectedRecipient}
              fbData={{
                total_comments: commentsCount,
                total_reactions: facebook_insights?.total_reactions || 0,
                total_shares: facebook_insights?.shares || 0,
              }}
            />
          </div>
        </div>
        <div className={'mx-auto w-full md:w-[unset] md:mt-10 xl:mt-0'}>
          <div className={'xl:hidden'}>
            <HugsMessagesShares
              recipient={selectedRecipient}
              fbData={{
                total_comments: commentsCount,
                total_reactions: facebook_insights?.total_reactions || 0,
                total_shares: facebook_insights?.shares || 0,
              }}
            />
          </div>
          <MostRecentEngagementContainer user_id={user_id}>
            <MostRecentEngagements
              allEngagements={allEngagements}
              user_id={user_id}
            />
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
