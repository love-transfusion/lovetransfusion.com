import { I_Comments } from '@/types/Comments.types'
import { filter_deleted_comments } from '../(logged-in-pages)/dashboard/[user_id]/actions'
import MostRecentEngagementContainer from '../(logged-in-pages)/dashboard/[user_id]/MostRecentEngagementContainer'
import MostRecentEngagements from '../(logged-in-pages)/dashboard/[user_id]/MostRecentEngagements'
import { supa_select_user } from '../_actions/users/actions'
import { supa_select_facebook_comments } from '../_actions/facebook_comments/actions'
import { I_supaorg_recipient } from '../_actions/orgRecipients/actions'

const Page = async () => {
  const user_id = 'c1db3cd6-3f92-45ee-b393-136c65685d5b'

  const [{ data: selectedUser }] = await Promise.all([
    supa_select_user(user_id),
  ])

  if (!selectedUser) return

  const { data: FBComments } = selectedUser.facebook_posts?.post_id
    ? await supa_select_facebook_comments({
        clCurrentPage: 1,
        clLimit: 100,
        post_id: selectedUser.facebook_posts.post_id,
      })
    : { data: [] }

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

  const allEngagements = await filter_deleted_comments(
    [
      ...formattedFBComments,
      ...(formattedWebsiteComments ?? []),
      ...(formattedWebsiteHugs ?? []),
    ],
    selectedUser.receipients_deleted_messages
  )
  return (
    <div className="max-w-[337px] max-h-[586px] mx-auto mt-10">
      <MostRecentEngagementContainer user_id={user_id}>
        <MostRecentEngagements
          allEngagements={allEngagements}
          user_id={user_id}
        />
      </MostRecentEngagementContainer>
    </div>
  )
}

export default Page
