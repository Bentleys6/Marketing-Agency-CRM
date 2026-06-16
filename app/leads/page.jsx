'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STATUS_COLORS = {
  New:        { bg: '#dbeafe', color: '#1e40af' },
  Contacted:  { bg: '#fef9c3', color: '#854d0e' },
  Qualified:  { bg: '#dcfce7', color: '#166534' },
  Lost:       { bg: '#fee2e2', color: '#991b1b' },
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => { setLeads(data); setLoading(false) })
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Leads</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px' }}>
            {leads.length} total lead{leads.length !== 1 ? 's' : ''}
          </p>
        </div>
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
                {['Name', 'Email', 'Phone', 'Company', 'Status', 'Added'].map(h => (
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
