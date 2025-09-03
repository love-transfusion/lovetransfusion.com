import Icon_eyes from '@/app/components/icons/Icon_eyes'
import UpdateButton from './UpdateDatabaseButton'
import Link from 'next/link'
import Engagements from './Engagements'
import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { isAdmin } from '@/app/lib/adminCheck'
import Icon_edit from '@/app/components/icons/Icon_edit'
import SearchInput from './SearchInput'
// import { supa_select_users_data_website } from '@/app/_actions/users_data_website/actions'
// import { supa_admin_search_multiple_users } from '@/app/_actions/admin/actions'
import ResetUserInStore from './ResetUserInStore'
// import { supa_select_org_recipients } from '@/app/_actions/orgRecipients/actions'
import DeleteUser from './DeleteUser'
import {
  AdWiseInsight,
  util_multiple_fetchAdWiseInsights,
} from '@/app/utilities/facebook/util_facebookApi'
// import DeleteUsersDataWebsite from './DeleteUsersDataWebsite'
import Icon_dashboard from '@/app/components/icons/Icon_dashboard'
import { I_supa_select_user_Response_Types } from '@/app/_actions/users/actions'
// import { getNetworkCount } from '@/app/(logged-in-pages)/dashboard/[user_id]/getNetworkCounts'
import { supa_select_users_data_website } from '@/app/_actions/users_data_website/actions'
import { supa_admin_search_multiple_users } from '@/app/_actions/admin/actions'
import { util_getFBPostID } from '@/app/utilities/facebook/util_getFBPostID'
import { util_getFBPageAccessToken } from '@/app/utilities/facebook/util_getFBPageAccessToken'
import { util_fetchFBAdShareCount } from '@/app/utilities/facebook/util_fetchFBAdShareCount'
import { util_fetchAdComments } from '@/app/utilities/facebook/util_fetchAdComments'
import { Json } from '@/types/database.types'
import { util_formatDateToUTCString } from '@/app/utilities/date-and-time/util_formatDateToUTCString'
import { supa_select_org_recipients } from '@/app/_actions/orgRecipients/actions'
import Pagination from '@/app/components/Pagination'
import { facebookPageID } from '@/app/lib/facebookPageID'

interface I_users_list_Types {
  recipientObj: I_supa_users_data_website_row
  users_data_facebook?: I_supa_users_data_facebook_row
  isDraft: boolean
  hasCreatedAccount: boolean
  isPresentInLTOrg: boolean
  user?: I_supa_users_row
}

export interface I_combineddataOfRecipient
  extends I_supa_users_data_website_row {
  recipient: I_supa_select_user_Response_Types | null
  userFBInsights: AdWiseInsight[] | undefined
}

export const maxDuration = 60

interface AdminDashboard_Types {
  searchParams: Promise<{
    page: string | undefined
  }>
}

const AdminDashboard = async (props: AdminDashboard_Types) => {
  const { page: stringPage } = await props.searchParams
  const page = parseInt(stringPage ?? '1')
  const recipient = await getCurrentUser()
  isAdmin({ clRole: recipient?.role, clThrowIfUnauthorized: true })

  const clLimit = 12

  // Level 1
  const { data: comRecipients, count } = await supa_select_users_data_website({
    clCurrentPage: page,
    clLimit,
  })

  // Level 2
  const [{ recipients: orgRecipients }, { data: comUsers }] = await Promise.all(
    [
      supa_select_org_recipients({
        searchIds: comRecipients.map((item) => item.id),
      }),
      supa_admin_search_multiple_users(
        comRecipients
          .map((item) => {
            if (!item.user_id) return null
            return item.user_id
          })
          .filter((id): id is string => id !== null)
      ),
    ]
  )

  const usersWithFbID = (
    comUsers.filter((user) => {
      const adIDs = user.fb_ad_IDs as string[]
      if (adIDs && adIDs.length) return true
      return false
    }) ?? []
  ).map((item) => {
    return {
      id: item.id,
      fb_ad_IDs: item.fb_ad_IDs as string[],
    }
  })

  const FBInsights: I_supa_users_data_facebook_row[] = await Promise.all(
    usersWithFbID.map(async (item) => {
      const [{ data: postID }, { data: pageAccessToken }, { data: insights }] =
        await Promise.all([
          util_getFBPostID({
            adId: item.fb_ad_IDs[0],
          }),
          util_getFBPageAccessToken({
            pageId: facebookPageID,
          }),
          util_multiple_fetchAdWiseInsights(item.fb_ad_IDs),
        ])

      const [{ count: share_count }, { data: comments }] = await Promise.all([
        postID && pageAccessToken
          ? await util_fetchFBAdShareCount({ postID, pageAccessToken })
          : { count: 0 },
        postID && pageAccessToken
          ? await util_fetchAdComments({ postID, pageAccessToken })
          : { data: null },
      ])

      return {
        insights: insights as Json,
        comments: comments as Json,
        share_count,
        updated_at: util_formatDateToUTCString(new Date()),
        id: item.id,
      }
    })
  )

  const newListOfUsers: I_users_list_Types[] = comRecipients.map((com) => {
    const users_data_facebook = FBInsights.find(
      (item) => item.id === com.user_id
    )
    const isPresentInLTOrg = orgRecipients.some((item) => item.id === com.id)
    const isDraft = orgRecipients.some(
      (item) => item.id === com.id && item.page_status === 'draft'
    )
    const user = comUsers.find((item) => item.id === com.user_id)
    return {
      recipientObj: com,
      users_data_facebook,
      isDraft,
      hasCreatedAccount: !!com.user_id,
      isPresentInLTOrg,
      user,
    }
  })

  return (
    <>
      <div
        className={
          'max-w-[1480px] mx-auto px-4 md:px-6 lg:px-10 xl:px-10 pb-10'
        }
      >
        <div
          className={
            'flex flex-col md:flex-row justify-between items-center gap-2 pt-10 md:pt-[68px] pb-5'
          }
        >
          <p className={'text-2xl md:text-[32px] font-bold'}>User Management</p>
          <div className={'flex gap-2 items-center'}>
            <SearchInput />
            <UpdateButton />
          </div>
        </div>
        <div className={'overflow-hidden shadow-lg rounded-lg md:rounded-xl'}>
          <div className={'overflow-x-auto pb-4'}>
            <table className="table-auto w-full">
              <thead className="bg-[#2F8FDD] text-white">
                <tr className="text-left leading-tight">
                  <td className="px-3 min-w-[140px] py-2">Parent Name</td>
                  <td className="px-3 min-w-[140px] py-2">Email</td>
                  <td className="px-3 min-w-[140px] py-2">Recipient Name </td>
                  <td className="px-3 min-w-[140px] py-2">Relationship</td>
                  <td className="px-3 min-w-[140px] py-2">Date Submitted</td>
                  <td className="px-3 min-w-[100px] py-2">Birthday</td>
                  <td className="px-3 min-w-[140px] py-2">Engagements</td>
                  <td className="px-3 min-w-[100px] py-2">Status</td>
                  <td className="px-3 min-w-[140px] py-2">Actions</td>
                </tr>
              </thead>
              <tbody>
                {newListOfUsers
                  .sort((a, b) => {
                    const userA = a.recipientObj
                      .recipient as I_supaorg_recipient_hugs_counters_comments
                    const userB = b.recipientObj
                      .recipient as I_supaorg_recipient_hugs_counters_comments
                    const dateA = new Date(userA.created_at).getTime()
                    const dateB = new Date(userB.created_at).getTime()
                    return dateB - dateA
                  })
                  .map((item) => {
                    const recipientData = item.recipientObj
                      .recipient as I_supaorg_recipient_hugs_counters_comments
                    return (
                      <tr
                        key={item.recipientObj.recipient.id}
                        className="even:bg-[#F3F3F3] border-y border-neutral-200"
                      >
                        <td className="py-[6px] px-3">
                          <p className={''}>{recipientData.parent_name}</p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={''}>{recipientData.email}</p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={'capitalize'}>
                            {recipientData.first_name}
                          </p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={''}>{recipientData.relationship}</p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={''}>
                            {new Date(
                              recipientData.created_at
                            ).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={''}>
                            {item.user?.birthday
                              ? new Date(
                                  item.user.birthday
                                ).toLocaleDateString()
                              : '-'}
                          </p>
                        </td>
                        <td className="py-[6px] px-2">
                          <Engagements
                            users_data_facebook={item.users_data_facebook}
                            recipient={item.recipientObj.recipient}
                          />
                        </td>
                        <td className="py-[6px] px-3">
                          <div>
                            <p
                              className={`text-sm py-[2px] px-2  border-2 shadow-md rounded-full w-fit min-w-[85px] text-center ${
                                item.isDraft &&
                                item.isPresentInLTOrg &&
                                'text-neutral-500 border-neutral-300 bg-neutral-50'
                              } ${
                                !item.isDraft &&
                                item.hasCreatedAccount &&
                                item.isPresentInLTOrg &&
                                'text-primary border-primary bg-primary-100'
                              } ${
                                !item.isDraft &&
                                item.isPresentInLTOrg &&
                                !item.hasCreatedAccount &&
                                'text-green-500 border-green-300 bg-green-50'
                              } ${
                                !item.isPresentInLTOrg &&
                                'text-red-500 border-red-300 bg-red-50'
                              }`}
                            >
                              {item.isDraft && item.isPresentInLTOrg && 'draft'}
                              {!item.isDraft &&
                                item.hasCreatedAccount &&
                                item.isPresentInLTOrg &&
                                'live'}
                              {!item.isDraft &&
                                item.isPresentInLTOrg &&
                                !item.hasCreatedAccount &&
                                'published'}
                              {!item.isPresentInLTOrg && 'deleted'}
                            </p>
                          </div>
                        </td>
                        <td className="py-[6px] px-3">
                          <div
                            className={
                              'grid grid-cols-3 gap-[2px] w-full max-w-[80px] items-center'
                            }
                          >
                            <div>
                              {item.hasCreatedAccount ? (
                                <Link
                                  href={`/dashboard/${item.recipientObj.user_id}`}
                                >
                                  <Icon_dashboard className="size-5" />
                                </Link>
                              ) : (
                                <p className={'text-center text-neutral-300'}>
                                  -
                                </p>
                              )}
                            </div>
                            <div>
                              {item.hasCreatedAccount ? (
                                <Link href={`/admin/${recipientData.id}`}>
                                  <Icon_edit className="size-5 text-primary" />
                                </Link>
                              ) : !item.isDraft ? (
                                <Link href={`/admin/${recipientData.id}`}>
                                  <Icon_eyes className="size-5 text-primary" />
                                </Link>
                              ) : (
                                <p className={'text-center text-neutral-300'}>
                                  -
                                </p>
                              )}
                            </div>
                            <div>
                              {item.hasCreatedAccount ? (
                                <DeleteUser recipientObj={item.recipientObj} />
                              ) : (
                                <p className={'text-center text-neutral-300'}>
                                  -
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          <div className="p-5">
            <Pagination
              clCount={count}
              clLimit={clLimit}
              clCurrentPage={page.toString()}
            />
          </div>
        </div>
      </div>
      <ResetUserInStore />
    </>
  )
}

export default AdminDashboard
