import Icon_eyes from '@/app/components/icons/Icon_eyes'
import Icon_left from '@/app/components/icons/Icon_left'
import Icon_refresh from '@/app/components/icons/Icon_refresh'
import Icon_right from '@/app/components/icons/Icon_right'
import Icon_search from '@/app/components/icons/Icon_search'
import Icon_trash from '@/app/components/icons/Icon_trash'
import Input from '@/app/components/inputs/basic-input/Input'
import UpdateButton from './UpdateDatabaseButton'
import Link from 'next/link'
import Engagements from './Engagements'
// import { fetchDataFromLTOrg } from './actions'
import { getCurrentUser } from '@/app/config/supabase/getCurrentUser'
import { isAdmin } from '@/app/lib/adminCheck'
import { supa_admin_select_paginated_recipients } from './[recipient]/actions'
import Icon_edit from '@/app/components/icons/Icon_edit'

const AdminDashboard = async () => {
  const user = await getCurrentUser()
  isAdmin({ clRole: user?.role, clThrowIfUnauthorized: true })

  const { data: comRecipients } = await supa_admin_select_paginated_recipients()

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
            <Input
              clPlaceholder="Search..."
              clVariant="input2"
              clLeftIcon={<Icon_search />}
              clIconClassName="text-neutral-400"
              className="shadow-inner"
            />
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
                  <td className="px-3 min-w-[140px] py-2">Engagements</td>
                  <td className="px-3 min-w-[140px] py-2">Actions</td>
                </tr>
              </thead>
              <tbody>
                {comRecipients
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
                          <p className={''}>{recipient.first_name}</p>
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
                          <Engagements recipient={recipient} />
                        </td>
                        <td className="py-[6px] px-3">
                          <div className={'flex gap-2 justify-start'}>
                            {comRecipient.user_id ? (
                              <Link href={`/dashboard/${comRecipient.user_id}`}>
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
                            <Icon_trash className="size-5 text-red-500" />
                          </div>
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
    </>
  )
}

export default AdminDashboard
