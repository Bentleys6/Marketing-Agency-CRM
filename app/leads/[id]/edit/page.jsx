'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost']

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  background: '#fff',
}

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.85rem',
  color: '#374151',
  marginBottom: '0.4rem',
}

export default function EditLeadPage() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          company: data.company || '',
          status: data.status || 'New',
          revenue: data.revenue ?? '',
        })
        setLoading(false)
      })
  }, [id])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.')
      return
    }
    setSubmitting(true)
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/leads')
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
      setSubmitting(false)
    }
  }

  if (loading || !form) {
    return <p style={{ color: '#94a3b8' }}>Loading...</p>
  }

  return (
    <div style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/leads" style={{ color: '#64748b', fontSize: '0.85rem' }}>← Back to Leads</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>Edit Lead</h1>
      </div>

      <form onSubmit={handleSubmit} style={{
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

        <div style={{ display: 'grid', gap: '1.1rem' }}>
          <div>
            <label style={labelStyle} htmlFor="name">Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input id="name" name="name" value={form.name} onChange={handleChange}
              placeholder="Jane Smith" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="email">Email <span style={{ color: '#ef4444' }}>*</span></label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="jane@example.com" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
              placeholder="+1 555 000 0000" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="company">Company</label>
            <input id="company" name="company" value={form.company} onChange={handleChange}
              placeholder="Acme Inc." style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="revenue">Revenue ($)</label>
            <input id="revenue" name="revenue" type="number" min="0" step="0.01" value={form.revenue} onChange={handleChange}
              placeholder="0.00" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="submit" disabled={submitting} style={{
            background: '#1e40af', color: '#fff', padding: '0.7rem 1.5rem',
            border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
          }}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/leads" style={{
            padding: '0.7rem 1.25rem', border: '1px solid #cbd5e1', borderRadius: '8px',
            fontWeight: 600, fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center'
          }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
