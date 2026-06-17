import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import getDb from '@/lib/db'

export async function POST(request) {
  try {
    const secret = request.headers.get('x-init-secret')
    if (secret !== process.env.INIT_SECRET) {
      return NextResponse.json({ error: 'Forbidden: setup key does not match INIT_SECRET' }, { status: 403 })
    }

    const { name, email, password } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'name, email, password are required' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const db = getDb()
    await db.execute({
      sql: `INSERT INTO users (name, email, password) VALUES (?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET name = excluded.name, password = excluded.password`,
      args: [name, email, hashed],
    })

    return NextResponse.json({ ok: true, message: `User created/updated: ${email}` })
  } catch (err) {
    console.error('create-user failed:', err)
    return NextResponse.json({ error: err?.message || 'Unknown server error' }, { status: 500 })
  }
}
