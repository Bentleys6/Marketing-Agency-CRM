'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { STATUSES } from '@/lib/leadStatus'

const textareaStyle = {
  width: '100%',
  minHeight: '260px',
  padding: '0.85rem',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontFamily: 'monospace',
  outline: 'none',
  background: '#fff',
  resize: 'vertical',
}

const NAME_KEYS = ['name', 'fullName', 'full_name', 'title']
const EMAIL_KEYS = ['email', 'emailAddress', 'email_address']
const PHONE_KEYS = ['phone', 'phoneNumber', 'phone_number', 'mobile']
const COMPANY_KEYS = ['company', 'companyName', 'company_name', 'organization']

function pick(obj, keys) {
  for (const key of keys) {
    if (obj[key] != null && obj[key] !== '') return obj[key]
  }
  return ''
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).filter(Boolean).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row = {}
    headers.forEach((h, i) => { row[h] = values[i] })
    return row
  })
}

function normalizeLeads(rawRows) {
  return rawRows.map(row => ({
    name: pick(row, NAME_KEYS),
    email: pick(row, EMAIL_KEYS),
    phone: pick(row, PHONE_KEYS),
    company: pick(row, COMPANY_KEYS),
    status: STATUSES.includes(row.status) ? row.status : 'Uncalled',
    revenue: 0,
    tag: row.tag || '',
  }))
}

export default function ImportLeadsPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleImport() {
    setError('')
    setResult(null)

    let rawRows
    try {
      const parsed = JSON.parse(text)
      rawRows = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      try {
        rawRows = parseCsv(text)
      } catch {
        setError('Could not parse that as JSON or CSV. Paste a JSON array of leads, or CSV with a header row.')
        return
      }
    }

    if (!rawRows.length) {
      setError('No rows found to import.')
      return
    }

    const leads = normalizeLeads(rawRows)

    setSubmitting(true)
    const res = await fetch('/api/leads/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads }),
    })
    const data = await res.json()
    setSubmitting(false)

    if (res.ok) {
      setResult(data)
    } else {
      setError(data.error || 'Something went wrong.')
    }
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/leads" style={{ color: '#64748b', fontSize: '0.85rem' }}>← Back to Leads</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>Import Leads</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Paste a JSON array (e.g. exported from Apify) or CSV with a header row. Recognized fields:
          name/fullName, email, phone/phoneNumber, company/companyName.
        </p>
      </div>

      <div style={{
        background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.75rem'
      }}>
        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem',
            borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{
            background: '#dcfce7', color: '#166534', padding: '0.75rem 1rem',
            borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem'
          }}>
            <p>Created {result.created} lead{result.created !== 1 ? 's' : ''}, skipped {result.skipped}.</p>
            {result.errors?.length > 0 && (
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.1rem' }}>
                {result.errors.slice(0, 10).map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={'[\n  { "name": "Jane Smith", "email": "jane@example.com", "phone": "555-0100" }\n]\n\nor CSV:\nname,email,phone\nJane Smith,jane@example.com,555-0100'}
          style={textareaStyle}
        />

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button onClick={handleImport} disabled={submitting || !text.trim()} style={{
            background: '#1e40af', color: '#fff', padding: '0.7rem 1.5rem',
            border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
          }}>
            {submitting ? 'Importing...' : 'Import Leads'}
          </button>
          <button onClick={() => router.push('/leads')} style={{
            padding: '0.7rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '8px',
            fontWeight: 600, fontSize: '0.9rem', color: '#475569', background: 'none', cursor: 'pointer',
          }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
