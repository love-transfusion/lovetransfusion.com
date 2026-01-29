import { supa_admin_delete_auth_user } from '@/app/_actions/admin/actions'
import {
  supa_delete_recipient,
  supa_select_recipients,
} from '@/app/_actions/recipients/actions'
import { supa_select_users_all } from '@/app/_actions/users/actions'
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

  const CRON = req.headers.get('authorization') ?? ''

  try {
    const { data: selectedRecipients, error: recipientError } =
      await supa_select_recipients(
        {
          in_memoriam: true,
        },
        CRON,
      )
    if (recipientError) {
      return NextResponse.json(
        { ok: false, error: recipientError },
        { status: 500 },
      )
    }

    if (
      !selectedRecipients ||
      !Array.isArray(selectedRecipients) ||
      !!!selectedRecipients.length
    ) {
      return NextResponse.json({ ok: true, deletedRecipientsCount: 0 })
    }

    const deleteRecipientsTasks = selectedRecipients.map((recipient) =>
      supa_delete_recipient({
        recipient_id: recipient.id,
        CRON,
      }),
    )
    await Promise.all(deleteRecipientsTasks)

    const { data: selectedUsers, error } = await supa_select_users_all(
      {
        mode: 'search',
        searchIDs: selectedRecipients.map((recipient) => recipient.id),
      },
      CRON,
    )
    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 500 })
    }

    if (!!selectedUsers?.length) {
      const tasks = selectedUsers.map((recipient) =>
        supa_admin_delete_auth_user(recipient.id),
      )
      await Promise.all(tasks)
    } else {
      return NextResponse.json({ ok: true, deletedUsers: 0 })
    }

    return NextResponse.json({ ok: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Unknown error' },
      { status: 500 },
    )
  }
}
