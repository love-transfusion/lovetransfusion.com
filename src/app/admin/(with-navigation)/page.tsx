import Icon_eyes from '@/app/components/icons/Icon_eyes'
import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { isAdmin } from '@/app/lib/adminCheck'
import Icon_edit from '@/app/components/icons/Icon_edit'
import SearchInput from './SearchInput'
import ResetUserInStore from './ResetUserInStore'
import DeleteUser from './DeleteUser'
import Icon_dashboard from '@/app/components/icons/Icon_dashboard'
import {
  I_supa_select_user_Response_Types_withCommentsCount,
  supa_select_users_all,
} from '@/app/_actions/users/actions'
import Pagination from '@/app/components/Pagination'
import { supa_select_recipients_all } from '@/app/_actions/recipients/actions'
import LinkCustom from '@/app/components/Link/LinkCustom'
import Engagements from './Engagements'
import { I_supaorg_recipient } from '@/app/_actions/orgRecipients/actions'

export interface I_combineddataOfRecipient {
  recipientRow: I_supa_recipients_row
  user: I_supa_select_user_Response_Types_withCommentsCount | null | undefined
  hasCreatedAccount: boolean
  isPresentInLTOrg: boolean
  isDraft: boolean
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
  const clLimit = 16

  const { data: recipients, count } = await supa_select_recipients_all({
    clLimit,
    clCurrentPage: page,
  })

  const { data: users } = await supa_select_users_all({
    mode: 'search',
    searchIDs: recipients && recipients.map((item) => item.id),
  })

  // users[0].facebook_posts[0].facebook_comments[0].count
  const combinedData: I_combineddataOfRecipient[] =
    (recipients &&
      recipients.map((item) => {
        const recipientRow = item
        const recipientData = item.recipient as I_supaOrg_recipients_row
        const user = users?.find((user) => user.id === item.id)
        return {
          recipientRow,
          user,
          hasCreatedAccount: !!user,
          isPresentInLTOrg: !item.is_deleted,
          isDraft: recipientData.page_status === 'draft',
        }
      })) ??
    []
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
                {combinedData &&
                  combinedData
                    .sort((a, b) => {
                      const userA = a.recipientRow
                        .recipient as I_supaOrg_recipients_row
                      const userB = b.recipientRow
                        .recipient as I_supaOrg_recipients_row
                      const dateA = new Date(userA.created_at).getTime()
                      const dateB = new Date(userB.created_at).getTime()
                      return dateB - dateA
                    })
                    .map((item) => {
                      const recipientData = item.recipientRow
                        .recipient as I_supaOrg_recipients_row

                      const FBInsights =
                        item.user?.facebook_insights &&
                        !!item.user.facebook_insights.length
                          ? item.user?.facebook_insights[0]
                          : null

                      const unknown_recipient = item.recipientRow
                        .recipient as unknown
                      const recipient = unknown_recipient as I_supaorg_recipient

                      const facebook_post =
                        item.user?.facebook_posts && item.user.facebook_posts

                      const facebook_comments_count =
                        facebook_post?.facebook_comments &&
                        facebook_post.facebook_comments.length
                          ? facebook_post.facebook_comments[0].count
                          : 0

                      return (
                        <tr
                          key={recipientData.id}
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
                              fb_data={{
                                total_comments: facebook_comments_count,
                                total_reactions:
                                  FBInsights?.total_reactions || 0,
                                total_shares: FBInsights?.shares || 0,
                              }}
                              recipient={recipient}
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
                                {item.isDraft &&
                                  item.isPresentInLTOrg &&
                                  'draft'}
                                {!item.isDraft &&
                                  item.hasCreatedAccount &&
                                  item.isPresentInLTOrg &&
                                  'live'}
                                {!item.isDraft &&
                                  item.isPresentInLTOrg &&
                                  !item.hasCreatedAccount &&
                                  'published'}
                                {!item.isPresentInLTOrg && 'deleted/draft'}
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
                                  <LinkCustom
                                    href={`/dashboard/${recipientData.id}`}
                                  >
                                    <Icon_dashboard className="size-5" />
                                  </LinkCustom>
                                ) : (
                                  <p className={'text-center text-neutral-300'}>
                                    -
                                  </p>
                                )}
                              </div>
                              <div>
                                {item.user ? (
                                  <LinkCustom
                                    href={`/admin/${recipientData.id}`}
                                  >
                                    <Icon_edit className="size-5 text-primary" />
                                  </LinkCustom>
                                ) : recipientData.page_status ===
                                  'published' ? (
                                  <LinkCustom
                                    href={`/admin/${recipientData.id}`}
                                  >
                                    <Icon_eyes className="size-5 text-primary" />
                                  </LinkCustom>
                                ) : (
                                  <p className={'text-center text-neutral-300'}>
                                    -
                                  </p>
                                )}
                              </div>
                              <div>
                                {item.hasCreatedAccount ? (
                                  <DeleteUser
                                    user={item.user}
                                    recipient={recipientData}
                                  />
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
