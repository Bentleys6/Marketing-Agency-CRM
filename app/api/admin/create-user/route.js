import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import getDb from '@/lib/db'

export async function POST(request) {
  const secret = request.headers.get('x-init-secret')
  if (secret !== process.env.INIT_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { name, email, password } = await request.json()
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'name, email, password are required' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const db = getDb()
  await db.execute({
    sql: 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    args: [name, email, hashed],
  })

  return NextResponse.json({ ok: true, message: `User created: ${email}` })
}
