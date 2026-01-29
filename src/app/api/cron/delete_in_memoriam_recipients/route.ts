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

  const errors: string[] = []

  try {
    const { data: selectedRecipients, error: recipientError } =
      await supa_select_recipients({
        in_memoriam: true,
      })

    if (recipientError) errors.push(recipientError)

    if (!selectedRecipients || !Array.isArray(selectedRecipients)) return

    const deleteRecipientsTasks = selectedRecipients.map((recipient) =>
      supa_delete_recipient({
        recipient_id: recipient.id,
        CRON: req.headers.get('authorization'),
      }),
    )

    await Promise.all(deleteRecipientsTasks)

    const { data: selectedUsers, error } = await supa_select_users_all(
      {
        mode: 'search',
        searchIDs: selectedRecipients.map((recipient) => recipient.id),
      },
      req.headers.get('authorization'),
    )
    if (error) errors.push(error)

    if (selectedUsers) {
      const tasks = selectedUsers.map((recipient) =>
        supa_admin_delete_auth_user(recipient.id),
      )
      await Promise.all(tasks)
    }

    if (errors.length) {
      return NextResponse.json(
        { ok: false, error: errors.join(', ') },
        { status: 500 },
      )
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
