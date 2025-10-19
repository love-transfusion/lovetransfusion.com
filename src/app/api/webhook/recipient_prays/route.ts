/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdmin } from '@/app/config/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

// Optional: force Node runtime to ensure console works consistently
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Log headers for debugging
  const sig = request.headers.get('x-supabase-signature')

  // Verify the signature
  if (sig !== process.env.LT_ORG_ROUTE_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Try parsing the body
  let body: any
  try {
    body = await request.json()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, record } = body ?? {}
  if (!type) {
    return NextResponse.json({ error: 'Missing type' }, { status: 400 })
  }

  try {
    if (type === 'INSERT') {
      const supabase = await createAdmin()
      const thisRecord = record as I_supaOrg_prayer_recipients_prays_row

      const data: I_supa_recipient_prays_insert = {
        prayer_id: thisRecord.owner_id,
        created_at: thisRecord.created_at,
        recipient_id: thisRecord.post_id,
        location: thisRecord.location,
      }

      const { error } = await supabase.from('recipient_prays').insert(data)

      if (error) {
        throw new Error(error.message)
      }
    }

    return new NextResponse(null, { status: 204 })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Server error' },
      { status: 500 }
    )
  }
}
