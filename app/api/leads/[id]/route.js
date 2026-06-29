import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import getDb from '@/lib/db'
import { STATUSES } from '@/lib/leadStatus'

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
  const { name, email, phone, company, status, revenue, tag, assigned_to } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const safeStatus = STATUSES.includes(status) ? status : 'Uncalled'
  const safeRevenue = Number(revenue) || 0

  const db = getDb()
  await db.execute({
    sql: 'UPDATE leads SET name = ?, email = ?, phone = ?, company = ?, status = ?, revenue = ?, tag = ?, assigned_to = ? WHERE id = ?',
    args: [name, email, phone || null, company || null, safeStatus, safeRevenue, tag || null, assigned_to || null, id],
  })

  const result = await db.execute({ sql: 'SELECT * FROM leads WHERE id = ?', args: [id] })
  if (!result.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(result.rows[0])
}

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  if (!body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const db = getDb()
  await db.execute({
    sql: 'UPDATE leads SET status = ? WHERE id = ?',
    args: [body.status, id],
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
