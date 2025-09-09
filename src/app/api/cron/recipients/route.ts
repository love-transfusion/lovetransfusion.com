import { supa_select_orgRecipients } from '@/app/_actions/orgRecipients/actions'
import {
  supa_select_recipients_all,
  supa_upsert_recipients,
} from '@/app/_actions/recipients/actions'
import { Json } from '@/types/database.types'
import { NextRequest, NextResponse } from 'next/server'

const isAuthorizedCron = (req: NextRequest) => {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const { data: orgRecipients, error } = await supa_select_orgRecipients()
  if (error || !orgRecipients) {
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }

  const { data: comRecipients, error: selectError } =
    await supa_select_recipients_all()

  if (selectError) {
    return NextResponse.json({ ok: false, error: selectError }, { status: 500 })
  }

  const deletedRecipients =
    comRecipients
      ?.filter((com) => !orgRecipients.some((item) => item.id === com.id))
      .map((item) => {
        return {
          id: item.id,
          is_deleted: true,
          created_at: item.created_at,
          recipient: item.recipient,
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
      }
    }),
    ...deletedRecipients,
  ]
  const { error: upsertError } = await supa_upsert_recipients(
    formattedRecipients
  )

  if (upsertError) {
    return NextResponse.json({ ok: false, error: upsertError }, { status: 500 })
  }
}
