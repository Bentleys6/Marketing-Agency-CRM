import { NextResponse } from 'next/server'
import getDb from '@/lib/db'

export async function GET() {
  const db = getDb()
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all()
  return NextResponse.json(leads)
}

export async function POST(request) {
  const body = await request.json()
  const { name, email, phone, company, status } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const validStatuses = ['New', 'Contacted', 'Qualified', 'Lost']
  const safeStatus = validStatuses.includes(status) ? status : 'New'

  const db = getDb()
  const stmt = db.prepare(
    'INSERT INTO leads (name, email, phone, company, status) VALUES (?, ?, ?, ?, ?)'
  )
  const result = stmt.run(name, email, phone || null, company || null, safeStatus)

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid)
  return NextResponse.json(lead, { status: 201 })
}
