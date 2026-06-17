'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STATUS_COLORS = {
  New:        { bg: '#dbeafe', color: '#1e40af' },
  Contacted:  { bg: '#fef9c3', color: '#854d0e' },
  Qualified:  { bg: '#dcfce7', color: '#166534' },
  Lost:       { bg: '#fee2e2', color: '#991b1b' },
}

const cardStyle = {
  background: '#fff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  padding: '1.5rem',
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

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

  const closed = leads.filter(l => l.status === 'Qualified')
  const revenue = leads.reduce((sum, l) => sum + (Number(l.revenue) || 0), 0)
  const stats = [
    { label: 'Total Leads', value: leads.length },
    { label: 'Closed (Qualified)', value: closed.length },
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
              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {s.label}
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Leads</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px' }}>
            {leads.length} total lead{leads.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/leads/import" style={{
            background: '#fff',
            color: '#1e40af',
            border: '1px solid #1e40af',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}>
            Import
          </Link>
          <Link href="/leads/new" style={{
            background: '#1e40af',
            color: '#fff',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}>
            + Add Lead
          </Link>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : leads.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0',
          padding: '3rem', textAlign: 'center', color: '#94a3b8'
        }}>
          <p style={{ fontSize: '1rem' }}>No leads yet.</p>
          <Link href="/leads/new" style={{ color: '#1e40af', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>
            Add your first lead →
          </Link>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Name', 'Email', 'Phone', 'Company', 'Status', 'Added', ''].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => {
                const badge = STATUS_COLORS[lead.status] || STATUS_COLORS.New
                return (
                  <tr key={lead.id} style={{ borderBottom: i < leads.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{lead.name}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{lead.email}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{lead.phone || '—'}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{lead.company || '—'}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: badge.bg, color: badge.color,
                        padding: '0.2rem 0.65rem', borderRadius: '999px',
                        fontSize: '0.78rem', fontWeight: 600
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                      <Link href={`/leads/${lead.id}/edit`} style={{
                        color: '#1e40af', fontWeight: 600, fontSize: '0.82rem', marginRight: '1rem',
                      }}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={deletingId === lead.id}
                        style={{
                          background: 'none', border: 'none', color: '#dc2626',
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
