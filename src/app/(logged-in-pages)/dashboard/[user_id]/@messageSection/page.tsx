import React from 'react'
import MessagesSection from '../MessagesSection'
import { filter_deleted_comments } from '../actions'
import { I_Comments } from '@/types/Comments.types'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'
import { supa_select_facebook_comments } from '@/app/_actions/facebook_comments/actions'
import { supa_select_user } from '@/app/_actions/users/actions'

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const result: T[][] = []
  let chunk: T[] = []

  for (let i = 0; i < arr.length; i++) {
    chunk.push(arr[i])
    if (chunk.length === size) {
      result.push(chunk)
      chunk = []
    }
  }

  if (chunk.length) {
    result.push(chunk)
  }

  return result
}

interface MessageSlot_Types {
  params: Promise<{ user_id: string }>
  searchParams: Promise<{ page: string | undefined }>
}

const MessageSlot = async (props: MessageSlot_Types) => {
  const { user_id } = await props.params
  const { page: stringPage } = await props.searchParams
  const page = parseInt(stringPage ?? '1')
  const clLimit = 100

  const [{ data: selectedUser }] = await Promise.all([
    supa_select_user(user_id),
  ])

  if (!selectedUser) return

  const { data: FBComments, count } = selectedUser.facebook_posts?.post_id
    ? await supa_select_facebook_comments({
        clCurrentPage: page,
        clLimit,
        post_id: selectedUser.facebook_posts.post_id,
      })
    : { data: [], count: 0 }

  const selectedRecipient =
    selectedUser.recipients &&
    !!selectedUser.recipients.length &&
    (selectedUser.recipients[0].recipient as unknown as
      | I_supaorg_recipient
      | undefined)

  const formattedFBComments: I_Comments[] =
    FBComments?.filter((item) => item.message)?.map((item) => {
      return {
        type: 'facebook',
        id: item.comment_id,
        name: item.from_name ?? 'Someone Who Cares',
        message: item.message,
        created_at: item.created_time,
        commentator_id: item.from_id,
      }
    }) ?? []

  const formattedWebsiteComments: I_Comments[] | null = selectedRecipient
    ? selectedRecipient.comments.map((item) => {
        return {
          type: 'website',
          id: item.id,
          name: item.name ?? 'Someone Who Cares',
          message: item.comment ?? 'Empty',
          created_at: item.created_at,
          profile_picture_website: item.public_profiles,
        }
      })
    : null

  // Group the website comments to fit pagination of the other networks
  const groupedWebsiteComments = chunkArray(
    formattedWebsiteComments ?? [],
    clLimit,
  ) // clLimit is the basis of how many items per array

  const allComments = await filter_deleted_comments(
    [
      ...(groupedWebsiteComments.length >= page
        ? groupedWebsiteComments[page - 1]
        : []),
      ...formattedFBComments,
    ].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    }),
    selectedUser.receipients_deleted_messages,
  )

  const recipient_prays = selectedUser.recipient_prays
  return (
    <>
      <MessagesSection
        clUser_id={user_id}
        clComments={allComments}
        selectedUser={selectedUser}
        clCount={count}
        clCurrentPage={page.toString()}
        clLimit={clLimit}
        recipient_prays={recipient_prays}
      />
    </>
  )
}

export default MessageSlot
