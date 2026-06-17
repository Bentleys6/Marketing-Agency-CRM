import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import getDb from '@/lib/db'
import { STATUSES } from '@/lib/leadStatus'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  const result = await db.execute('SELECT * FROM leads ORDER BY created_at DESC')
  return NextResponse.json(result.rows)
}

export async function POST(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, email, phone, company, status, revenue, tag } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const safeStatus = STATUSES.includes(status) ? status : 'Uncalled'
  const safeRevenue = Number(revenue) || 0

  const db = getDb()
  const result = await db.execute({
    sql: 'INSERT INTO leads (name, email, phone, company, status, revenue, tag) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [name, email, phone || null, company || null, safeStatus, safeRevenue, tag || null],
  })

  const lead = await db.execute({
    sql: 'SELECT * FROM leads WHERE id = ?',
    args: [result.lastInsertRowid],
  })

  return NextResponse.json(lead.rows[0], { status: 201 })
}
