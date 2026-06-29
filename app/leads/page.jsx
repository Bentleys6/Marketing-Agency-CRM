'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { STATUS_COLORS, TEAM_MEMBERS } from '@/lib/leadStatus'
import { colors, cardStyle, pillStyle, primaryButtonStyle, secondaryButtonStyle } from '@/lib/theme'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [activeTag, setActiveTag] = useState('All')
  const [activeMember, setActiveMember] = useState('All')

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => { setLeads(data); setLoading(false) })
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this lead? This cannot be undone.')) return
    setDeletingId(id)
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setLeads(prev => prev.filter(l => l.id !== id))
    }
    setDeletingId(null)
  }

  const tags = [...new Set(leads.map(l => l.tag).filter(Boolean))].sort()
  const visibleLeads = leads
    .filter(l => activeTag === 'All' || l.tag === activeTag)
    .filter(l => activeMember === 'All' || l.assigned_to === activeMember)

  const closed = leads.filter(l => l.status === 'Closed')
  const revenue = leads.reduce((sum, l) => sum + (Number(l.revenue) || 0), 0)
  const stats = [
    { label: 'Total Leads', value: leads.length },
    { label: 'Closed', value: closed.length },
    { label: 'Revenue Generated', value: formatCurrency(revenue) },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Dashboard</h1>

      {!loading && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {stats.map(s => (
            <div key={s.label} style={cardStyle}>
              <p style={{ color: colors.textMuted, fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {s.label}
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: colors.primaryLight }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Leads</h2>
          <p style={{ color: colors.textMuted, fontSize: '0.9rem', marginTop: '2px' }}>
            {leads.length} total lead{leads.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/leads/board" style={secondaryButtonStyle}>
            Board View
          </Link>
          <Link href="/leads/import" style={secondaryButtonStyle}>
            Import
          </Link>
          <Link href="/leads/new" style={primaryButtonStyle}>
            + Add Lead
          </Link>
        </div>
      </div>

      {!loading && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {['All', ...TEAM_MEMBERS].map(member => (
            <button
              key={member}
              onClick={() => setActiveMember(member)}
              style={pillStyle(activeMember === member)}
            >
              {member}
            </button>
          ))}
        </div>
      )}

      {!loading && tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {['All', ...tags].map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={pillStyle(activeTag === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p style={{ color: colors.textFaint }}>Loading...</p>
      ) : leads.length === 0 ? (
        <div style={{
          background: colors.surface, borderRadius: '12px', border: `1px solid ${colors.border}`,
          padding: '3rem', textAlign: 'center', color: colors.textFaint
        }}>
          <p style={{ fontSize: '1rem' }}>No leads yet.</p>
          <Link href="/leads/new" style={{ color: colors.primaryLight, fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>
            Add your first lead →
          </Link>
        </div>
      ) : (
        <div style={{ background: colors.surface, borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: colors.surfaceAlt, borderBottom: `1px solid ${colors.border}` }}>
                {['Name', 'Email', 'Phone', 'Company', 'Status', 'Tag', 'Assigned', 'Added', ''].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: colors.textMuted, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead, i) => {
                const badge = STATUS_COLORS[lead.status] || STATUS_COLORS.Uncalled
                return (
                  <tr key={lead.id} style={{ borderBottom: i < visibleLeads.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{lead.name}</td>
                    <td style={{ padding: '0.85rem 1rem', color: colors.textMuted }}>{lead.email}</td>
                    <td style={{ padding: '0.85rem 1rem', color: colors.textMuted }}>{lead.phone || '—'}</td>
                    <td style={{ padding: '0.85rem 1rem', color: colors.textMuted }}>{lead.company || '—'}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: badge.bg, color: badge.color,
                        padding: '0.2rem 0.65rem', borderRadius: '999px',
                        fontSize: '0.78rem', fontWeight: 600
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: colors.textMuted, fontSize: '0.82rem' }}>
                      {lead.tag || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: colors.textMuted, fontSize: '0.82rem' }}>
                      {lead.assigned_to || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: colors.textFaint, fontSize: '0.82rem' }}>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                      <Link href={`/leads/${lead.id}/edit`} style={{
                        color: colors.primaryLight, fontWeight: 600, fontSize: '0.82rem', marginRight: '1rem',
                      }}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={deletingId === lead.id}
                        style={{
                          background: 'none', border: 'none', color: colors.danger,
                          fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: 0,
                          opacity: deletingId === lead.id ? 0.5 : 1,
                        }}
                      >
                        {deletingId === lead.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
