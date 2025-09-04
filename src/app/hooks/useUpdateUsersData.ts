'use client'
import { useEffect } from 'react'
import { supa_select_org_recipients } from '../_actions/orgRecipients/actions'
import { util_fetchAdComments } from '../utilities/facebook/util_fetchAdComments'
import { util_getFBPostID } from '../utilities/facebook/util_getFBPostID'
import { I_supa_select_user_Response_Types } from '../_actions/users/actions'
import { util_getFBPageAccessToken } from '../utilities/facebook/util_getFBPageAccessToken'
import { supa_upsert_users_data_facebook } from '../_actions/users_data_facebook/actions'
import { util_fetchFBAdShareCount } from '../utilities/facebook/util_fetchFBAdShareCount'
import { supa_admin_upsert_list_of_recipients } from '../_actions/admin/actions'
import { util_multiple_fetchAdWiseInsights } from '../utilities/facebook/util_fb_insights'
import { useStore } from 'zustand'
import utilityStore from '../utilities/store/utilityStore'
import { Json } from '@/types/database.types'
import { env_FACEBOOK_PAGE_ID } from '../lib/_env_constants/constants.client'

interface I_useUpdateUsersData_Types {
  selectedUser: I_supa_select_user_Response_Types
}

const getFBCommentsAndShareCount = async (
  selectedUser: I_useUpdateUsersData_Types['selectedUser'],
  setfbError: (data: string | null) => void
) => {
  const adIDs = selectedUser.fb_ad_IDs as string[]

  const [
    { data: postID, error: postIDError },
    { data: pageAccessToken, error: pageAccessTokenError },
    { data: insights, error: insightsError },
  ] = await Promise.all([
    util_getFBPostID({ adId: adIDs[0] }),
    util_getFBPageAccessToken({
      pageId: env_FACEBOOK_PAGE_ID,
    }),
    util_multiple_fetchAdWiseInsights(adIDs),
  ])
  console.log({ insightsError, postIDError, pageAccessTokenError })
  if (insightsError || postIDError || pageAccessTokenError)
    setfbError(insightsError || postIDError || pageAccessTokenError)

  if (!postID || !pageAccessToken) return

  const [comments, share_count] = await Promise.all([
    util_fetchAdComments({
      postID,
      pageAccessToken,
    }),
    util_fetchFBAdShareCount({
      postID,
      pageAccessToken,
    }),
  ])
  return { comments, share_count, insights }
}

export const updateUserData = async (
  selectedUser: I_useUpdateUsersData_Types['selectedUser'],
  setfbError: (data: string | null) => void
) => {
  const orgRecipientID = selectedUser.users_data_website[0].id

  const [{ recipients }, fbData] = await Promise.all([
    supa_select_org_recipients(orgRecipientID),
    getFBCommentsAndShareCount(selectedUser, setfbError),
  ])

  const insights = fbData?.insights as Json

  await Promise.all([
    supa_admin_upsert_list_of_recipients([
      {
        id: orgRecipientID, // recipient's id
        recipient: recipients[0], // recipient object
      },
    ]),
    supa_upsert_users_data_facebook({
      id: selectedUser.id,
      comments: fbData?.comments.data,
      share_count: fbData?.share_count.count ?? 0,
      insights,
    }),
  ])
}

const useUpdateUsersData = ({ selectedUser }: I_useUpdateUsersData_Types) => {
  const { setfbError } = useStore(utilityStore)

  useEffect(() => {
    let isActive = true

    // clear any stale error when the effect starts
    setfbError(null)

    // wrap the setter so child funcs can't update after unmount
    const safeSetFbError = (msg: string | null) => {
      console.log({ msg })
      if (isActive) setfbError(msg)
    }

    const run = async () => {
      try {
        await updateUserData(selectedUser, safeSetFbError)
      } catch (err) {
        safeSetFbError((err as Error)?.message ?? 'Unknown error')
      }
    }

    // initial run + interval
    run()
    const interval = setInterval(run, 15 * 60 * 1000)

    // cleanup on unmount
    return () => {
      isActive = false
      clearInterval(interval)
      setfbError(null) // <-- reset error when the component unmounts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return
}

export default useUpdateUsersData
