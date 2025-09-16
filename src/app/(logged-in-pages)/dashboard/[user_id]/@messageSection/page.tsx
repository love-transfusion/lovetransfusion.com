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

  const { data: FBComments, count } = await supa_select_facebook_comments({
    clCurrentPage: page,
    clLimit,
    post_id:
      selectedUser.facebook_posts && !!selectedUser.facebook_posts.length
        ? selectedUser.facebook_posts[0].post_id
        : undefined,
  })

  const unknown_selectedRecipient = (selectedUser.recipients ?? [])[0]
    .recipient as unknown
  const selectedRecipient = unknown_selectedRecipient as I_supaorg_recipient

  const formattedFBComments: I_Comments[] =
    FBComments?.map((item) => {
      return {
        type: 'facebook',
        id: item.comment_id,
        name: item.from_name ?? 'Someone Who Cares',
        message: item.message ?? 'Empty',
        created_at: item.created_time,
        profile_picture: item.from_picture_url,
      }
    }) ?? []

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

  // Group the website comments to fit pagination of the other networks
  const groupedWebsiteComments = chunkArray(formattedWebsiteComments, clLimit) // clLimit is the basis of how many items per array

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
    selectedUser.receipients_deleted_messages
  )
  return (
    <>
      <MessagesSection
        clUser_id={user_id}
        clComments={allComments}
        selectedUser={selectedUser}
        clCount={count}
        clCurrentPage={page.toString()}
        clLimit={clLimit}
      />
    </>
  )
}

export default MessageSlot
