import { supa_admin_delete_auth_user } from '@/app/_actions/admin/actions'
import { supa_select_orgRecipients } from '@/app/_actions/orgRecipients/actions'
import {
  supa_select_recipients,
  supa_update_recipients,
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
  let deletedCount = 0

  try {
    const { data: recipients, error: recipientsError } =
      await supa_select_orgRecipients()
    if (recipientsError) errors.push(String(recipientsError))

    const inMemoriamRecipients =
      recipients?.filter((recipient) => recipient.in_memoriam) ?? []

    if (inMemoriamRecipients.length) {
      const { data: usersToDelete, error: usersError } =
        await supa_select_users_all({
          mode: 'search',
          searchIDs: inMemoriamRecipients.map((item) => item.id),
        })
      if (usersError) errors.push(String(usersError))

      if (!usersToDelete?.length) {
        if (errors.length) {
          return NextResponse.json(
            { ok: false, error: errors.join(', ') },
            { status: 500 },
          )
        }
        return NextResponse.json({ ok: true, deletedCount: 0 })
      }

      const tasks = usersToDelete.map((user) =>
        supa_admin_delete_auth_user(user.id),
      )
      await Promise.all(tasks)

      deletedCount = usersToDelete.length

      const { data: selectedRecipients, error } = await supa_select_recipients(
        inMemoriamRecipients.map((item) => item.id),
      )
      if (error) errors.push(error)

      if (selectedRecipients && Array.isArray(selectedRecipients)) {
        const updatedRecipients = selectedRecipients.map((item) => {
          return { ...item, is_deleted: true }
        })
        const updateRecipientTasks = updatedRecipients.map((recipient) =>
          supa_update_recipients(recipient),
        )
        await Promise.all(updateRecipientTasks)
      }
    }

    if (errors.length) {
      return NextResponse.json(
        { ok: false, error: errors.join(', '), deletedCount },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true, deletedCount })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Unknown error', deletedCount },
      { status: 500 },
    )
  }
}
