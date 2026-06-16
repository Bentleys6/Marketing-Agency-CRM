import { NextResponse } from 'next/server'
import { initDb } from '@/lib/db'

export async function GET(request) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.INIT_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  await initDb()
  return NextResponse.json({ ok: true, message: 'Database initialized' })
}
