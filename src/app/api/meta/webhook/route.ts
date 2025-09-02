// app/api/meta/webhook/route.ts
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('META_WEBHOOK_EVENT', JSON.stringify(body))
    return new Response('OK', { status: 200 })
  } catch {
    return new Response('Bad Request', { status: 400 })
  }
}
