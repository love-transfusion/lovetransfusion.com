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
    console.error('Unauthorized request: missing or invalid Bearer token')
    return new NextResponse('Unauthorized', { status: 401 })
  }

  console.log('Fetching orgRecipients...')
  const { data: orgRecipients, error } = await supa_select_orgRecipients()
  if (error || !orgRecipients) {
    console.error('Error selecting orgRecipients:', error)
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }
  console.log(`Fetched ${orgRecipients.length} orgRecipients`)

  console.log('Fetching comRecipients...')
  const { data: comRecipients, error: selectError } =
    await supa_select_recipients_all(undefined, process.env.CRON_SECRET!)

  if (selectError) {
    console.error('Error selecting comRecipients:', selectError)
    return NextResponse.json({ ok: false, error: selectError }, { status: 500 })
  }
  console.log(`Fetched ${comRecipients?.length ?? 0} comRecipients`)

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

  console.log(`Marked ${deletedRecipients.length} recipients as deleted`)

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

  console.log(
    `Prepared ${formattedRecipients.length} recipients for upsert (active + deleted)`
  )

  const { error: upsertError } = await supa_upsert_recipients(
    formattedRecipients,
    process.env.CRON_SECRET!
  )

  if (upsertError) {
    console.error('Error during upsert:', upsertError)
    return NextResponse.json({ ok: false, error: upsertError }, { status: 500 })
  }

  console.log('Upsert completed successfully.')
  return NextResponse.json({ ok: true, count: formattedRecipients.length })
}
