import Icon_eyes from '@/app/components/icons/Icon_eyes'
import Icon_left from '@/app/components/icons/Icon_left'
import Icon_refresh from '@/app/components/icons/Icon_refresh'
import Icon_right from '@/app/components/icons/Icon_right'
import UpdateButton from './UpdateDatabaseButton'
import Link from 'next/link'
import Engagements from './Engagements'
import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { isAdmin } from '@/app/lib/adminCheck'
import Icon_edit from '@/app/components/icons/Icon_edit'
import SearchInput from './SearchInput'
import { supa_select_paginated_recipients } from '@/app/_actions/users_data_website/actions'
import { supa_admin_search_multiple_users } from '@/app/_actions/admin/actions'
import ResetUserInStore from './ResetUserInStore'
import { fetchDataFromLTOrg } from '@/app/_actions/orgRecipients/actions'
import DeleteUser from './DeleteUser'
import {
  AdWiseInsight,
  util_fetchAdWiseInsights,
} from '@/app/utilities/facebook/util_facebookApi'

interface I_recipient_data {
  id: string
  page_status: string
}

interface I_orgRecipients {
  error: string | null
  recipients: I_recipient_data[] | null
}

export interface I_combineddataOfRecipient
  extends I_supa_users_data_website_row {
  user: I_supa_users_row | null
  userFBInsights: { ad_id: AdWiseInsight[] } | undefined
}

export const maxDuration = 60

const AdminDashboard = async () => {
  const user = await getCurrentUser()
  isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })

  const { data: comRecipients } = await supa_select_paginated_recipients()

  const { recipients: orgRecipients }: I_orgRecipients =
    await fetchDataFromLTOrg({
      searchIds: comRecipients.map((item) => item.id),
    })
  const draftRecipients =
    orgRecipients
      ?.filter((item) => item.page_status === 'draft')
      .map((item) => item.id) ?? []

  const IDs = comRecipients
    .map((item) => item.user_id)
    .filter((item): item is string => Boolean(item))

  // Search multiple users to get birthdate
  const { data: listOfusers } = await supa_admin_search_multiple_users(IDs)

  // Get users that has fb_ad_id
  const usersWithFbID = listOfusers?.filter((user) => user.fb_ad_id) ?? []

  const fbInsights: {
    ad_id: AdWiseInsight[]
  }[] = []

  for (const user of usersWithFbID) {
    if (user.fb_ad_id) {
      const ad_id = user.fb_ad_id
      const { data: result } = await util_fetchAdWiseInsights({
        ad_id,
      })
      const newObj = { ad_id: result ?? [] }
      fbInsights.push(newObj)
    }
  }

  const combinedData: I_combineddataOfRecipient[] = comRecipients.map(
    (item) => {
      return {
        ...item,
        user:
          listOfusers?.find((userObj) => userObj.id === item.user_id) ?? null,
        userFBInsights: (() => {
          const selectedUser = listOfusers?.find(
            (userObj) => userObj.id === item.user_id
          )?.fb_ad_id
          if (selectedUser) {
            return fbInsights.find((insight) =>
              insight.ad_id.some((p) => p.ad_id === selectedUser)
            )
          }
        })(),
      }
    }
  )
  console.log({ combinedData })
  return (
    <>
      <div className={'max-w-[1480px] mx-auto px-4 md:px-6 lg:px-10 xl:px-10 '}>
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
                <tr className="text-left text-lg leading-tight">
                  <td className="px-3 min-w-[140px] py-2">Parent Name</td>
                  <td className="px-3 min-w-[140px] py-2">Email</td>
                  <td className="px-3 min-w-[140px] py-2">Recipient Name </td>
                  <td className="px-3 min-w-[140px] py-2">Relationship</td>
                  <td className="px-3 min-w-[140px] py-2">Date Submitted</td>
                  <td className="px-3 min-w-[140px] py-2">Birthday</td>
                  <td className="px-3 min-w-[140px] py-2">Engagements</td>
                  <td className="px-3 min-w-[140px] py-2">Actions</td>
                </tr>
              </thead>
              <tbody>
                {combinedData
                  .sort((a, b) => {
                    const recA = a.recipient as unknown
                    const recB = b.recipient as unknown
                    const recipientA =
                      recA as I_supaorg_recipient_hugs_counters_comments
                    const recipientB =
                      recB as I_supaorg_recipient_hugs_counters_comments
                    const dateA = new Date(recipientA.created_at).getTime()
                    const dateB = new Date(recipientB.created_at).getTime()
                    return dateB - dateA
                  })
                  .map((comRecipient) => {
                    const recipientData = comRecipient.recipient as unknown
                    const recipient =
                      recipientData as I_supaorg_recipient_hugs_counters_comments
                    const totalFBReactions =
                      comRecipient.userFBInsights?.ad_id.reduce(
                        (sum, accu) => sum + accu.cl_total_reactions,
                        0
                      )
                    return (
                      <tr
                        key={recipient.id}
                        className="even:bg-[#F3F3F3] border-y border-neutral-200"
                      >
                        <td className="py-[6px] px-3">
                          <p className={''}>{recipient.parent_name}</p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={''}>{recipient.email}</p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={'capitalize'}>
                            {comRecipient.user?.recipient_name ??
                              recipient.first_name}
                          </p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={''}>{recipient.relationship}</p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={''}>
                            {new Date(
                              recipient.created_at
                            ).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-[6px] px-3">
                          <p className={''}>
                            {comRecipient.user?.birthday
                              ? new Date(
                                  comRecipient.user?.birthday
                                ).toLocaleDateString()
                              : '-'}
                          </p>
                        </td>
                        <td className="py-[6px] px-3">
                          <Engagements
                            totalFBReactions={totalFBReactions}
                            recipient={recipient}
                          />
                        </td>
                        <td className="py-[6px] px-3">
                          {!draftRecipients.includes(recipient.id) ? (
                            <div className={'flex gap-2 justify-start'}>
                              {comRecipient.user_id ? (
                                <Link
                                  href={`/dashboard/${comRecipient.user_id}`}
                                >
                                  <Icon_refresh className="size-5" />
                                </Link>
                              ) : (
                                <div className={'flex size-5'} />
                              )}
                              <Link href={`/admin/${recipient.id}`}>
                                {comRecipient.user_id ? (
                                  <Icon_edit className="size-5 text-primary" />
                                ) : (
                                  <Icon_eyes className="size-5 text-primary" />
                                )}
                              </Link>
                              {comRecipient.user_id && (
                                <DeleteUser user_id={comRecipient.user_id} />
                              )}
                            </div>
                          ) : (
                            <div
                              className={
                                'flex gap-2 justify-start items-center'
                              }
                            >
                              <p
                                className={
                                  'text-sm py-[2px] px-2 text-red-500 border-red-500 bg-red-100 border-2 shadow-md rounded-full w-fit'
                                }
                              >
                                draft
                              </p>
                              {comRecipient.user_id && (
                                <DeleteUser user_id={comRecipient.user_id} />
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          <div className={'flex gap-2 items-center my-3 justify-end px-6'}>
            <Icon_left className="size-5" />
            <div
              className={'size-8 relative bg-[#2F8FDD] rounded-full text-white'}
            >
              <p
                className={
                  'absolute top-0 bottom-0 right-0 left-0 m-auto h-fit w-fit'
                }
              >
                1
              </p>
            </div>
            <Icon_right className="size-5" />
          </div>
        </div>
      </div>
      <ResetUserInStore />
    </>
  )
}

export default AdminDashboard
