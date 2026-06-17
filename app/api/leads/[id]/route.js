import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import getDb from '@/lib/db'

const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost']

export async function GET(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = getDb()
  const result = await db.execute({ sql: 'SELECT * FROM leads WHERE id = ?', args: [id] })
  if (!result.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(result.rows[0])
}

export async function PUT(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { name, email, phone, company, status } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const safeStatus = VALID_STATUSES.includes(status) ? status : 'New'

  const db = getDb()
  await db.execute({
    sql: 'UPDATE leads SET name = ?, email = ?, phone = ?, company = ?, status = ? WHERE id = ?',
    args: [name, email, phone || null, company || null, safeStatus, id],
  })

  const result = await db.execute({ sql: 'SELECT * FROM leads WHERE id = ?', args: [id] })
  if (!result.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(result.rows[0])
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = getDb()
  await db.execute({ sql: 'DELETE FROM leads WHERE id = ?', args: [id] })

  return NextResponse.json({ ok: true })
}
