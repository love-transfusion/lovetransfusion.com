import { supa_admin_delete_auth_user } from '@/app/_actions/admin/actions'
import { supa_select_orgRecipients } from '@/app/_actions/orgRecipients/actions'
import {
  supa_delete_recipient,
  supa_select_recipients_all,
  supa_upsert_recipients,
} from '@/app/_actions/recipients/actions'
import { supa_select_users_all } from '@/app/_actions/users/actions'
import { Json } from '@/types/database.types'
import { NextRequest, NextResponse } from 'next/server'

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    console.error('Unauthorized request: missing or invalid Bearer token')
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const CRON = req.headers.get('authorization')

  const { data: orgRecipients, error } = await supa_select_orgRecipients()
  if (error || !orgRecipients) {
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }

  const { data: comRecipients, error: selectError } =
    await supa_select_recipients_all(undefined, CRON)

  if (selectError) {
    console.error('Error selecting comRecipients:', selectError)
    return NextResponse.json({ ok: false, error: selectError }, { status: 500 })
  }

  const orgRecipientIds = new Set(orgRecipients.map((item) => item.id))

  const deletedRecipients =
    comRecipients
      ?.filter((com) => !orgRecipientIds.has(com.id))
      .map((item) => {
        const recipient = item.recipient as unknown as I_supaOrg_recipients_row
        return {
          id: item.id,
          is_deleted: true,
          created_at: item.created_at,
          recipient: item.recipient,
          in_memoriam: recipient.in_memoriam,
        }
      }) ?? []

  const formattedRecipients = [
    ...orgRecipients.map((item) => {
      const unknown_item = item as unknown
      const newItem = unknown_item as Json
      return {
        id: item.id,
        created_at: item.created_at,
        recipient: newItem,
        is_deleted: false,
        in_memoriam: item.in_memoriam,
      }
    }),
    ...deletedRecipients,
  ]

  const in_memoriam_recipients = formattedRecipients
    .filter((item) => item.in_memoriam)
    .map((item) => item.id)

  const { data: selectedUsers, error: userSelectError } =
    await supa_select_users_all(
      {
        mode: 'search',
        searchIDs: in_memoriam_recipients,
      },
      CRON,
    )

  if (userSelectError) {
    console.error('Error selecting users:', userSelectError)
    return NextResponse.json(
      { ok: false, error: userSelectError },
      { status: 500 },
    )
  }

  if (in_memoriam_recipients && !!in_memoriam_recipients.length) {
    const deleteRecipients = in_memoriam_recipients.map((recipientID) =>
      supa_delete_recipient({ recipient_id: recipientID, CRON }),
    )
    await Promise.all(deleteRecipients)
  }

  if (selectedUsers && !!selectedUsers.length) {
    const deleteUsersTasks = selectedUsers.map((user) =>
      supa_admin_delete_auth_user(user.id),
    )
    await Promise.all(deleteUsersTasks)
  }

  const { error: upsertError } = await supa_upsert_recipients(
    formattedRecipients.filter(
      (rec) => !in_memoriam_recipients.includes(rec.id),
    ),
    CRON,
  )

  if (upsertError) {
    console.error('Error during upsert:', upsertError)
    return NextResponse.json({ ok: false, error: upsertError }, { status: 500 })
  }

  return NextResponse.json({ ok: true, count: formattedRecipients.length })
}
