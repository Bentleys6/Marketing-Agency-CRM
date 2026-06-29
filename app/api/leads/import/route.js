import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import getDb from '@/lib/db'
import { STATUSES } from '@/lib/leadStatus'

export async function POST(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const leads = Array.isArray(body?.leads) ? body.leads : null
  if (!leads) {
    return NextResponse.json({ error: 'Expected { leads: [...] }' }, { status: 400 })
  }

  const db = getDb()
  let created = 0
  let skipped = 0
  const errors = []

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i]
    const name = String(lead.name || '').trim()
    const email = String(lead.email || '').trim()

    if (!name || !email) {
      skipped++
      errors.push(`Row ${i + 1}: missing name or email`)
      continue
    }

    const safeStatus = STATUSES.includes(lead.status) ? lead.status : 'Uncalled'
    const safeRevenue = Number(lead.revenue) || 0

    try {
      await db.execute({
        sql: 'INSERT INTO leads (name, email, phone, company, status, revenue, tag, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        args: [name, email, lead.phone || null, lead.company || null, safeStatus, safeRevenue, lead.tag || null, lead.assigned_to || null],
      })
      created++
    } catch (err) {
      skipped++
      errors.push(`Row ${i + 1} (${email}): ${err.message}`)
    }
  }

  return NextResponse.json({ created, skipped, errors })
}
