'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { STATUSES, TEAM_MEMBERS } from '@/lib/leadStatus'
import { colors, inputStyle, labelStyle } from '@/lib/theme'

export default function NewLeadPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'Uncalled', revenue: '', tag: '', assigned_to: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/leads')
        return
      }
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { data = null }
      setError(data?.error || `Something went wrong (status ${res.status}).`)
    } catch (err) {
      setError(`Request failed: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/leads" style={{ color: colors.textMuted, fontSize: '0.85rem' }}>← Back to Leads</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>Add New Lead</h1>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: colors.surface, borderRadius: '12px', border: `1px solid ${colors.border}`, padding: '1.75rem'
      }}>
        {error && (
          <div style={{
            background: '#7f1d1d', color: '#fecaca', padding: '0.75rem 1rem',
            borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.1rem' }}>
          <div>
            <label style={labelStyle} htmlFor="name">Name <span style={{ color: colors.danger }}>*</span></label>
            <input id="name" name="name" value={form.name} onChange={handleChange}
              placeholder="Jane Smith" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="email">Email <span style={{ color: colors.danger }}>*</span></label>
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

          <div>
            <label style={labelStyle} htmlFor="tag">Tag</label>
            <input id="tag" name="tag" value={form.tag} onChange={handleChange}
              placeholder="e.g. Hot, Cold Call, Referral" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="assigned_to">Assigned To</label>
            <select id="assigned_to" name="assigned_to" value={form.assigned_to} onChange={handleChange}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Unassigned</option>
              {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="submit" disabled={submitting} style={{
            background: colors.primary, color: '#fff', padding: '0.7rem 1.5rem',
            border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
          }}>
            {submitting ? 'Saving...' : 'Add Lead'}
          </button>
          <Link href="/leads" style={{
            padding: '0.7rem 1.25rem', border: `1px solid ${colors.border}`, borderRadius: '8px',
            fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted, display: 'flex', alignItems: 'center'
          }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
