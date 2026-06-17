'use client'

import { useEffect, useState } from 'react'

const cardStyle = {
  background: '#fff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  padding: '1.5rem',
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export default function DashboardPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => { setLeads(data); setLoading(false) })
  }, [])

  if (loading) {
    return <p style={{ color: '#94a3b8' }}>Loading...</p>
  }

  const total = leads.length
  const closed = leads.filter(l => l.status === 'Qualified')
  const revenue = leads.reduce((sum, l) => sum + (Number(l.revenue) || 0), 0)

  const stats = [
    { label: 'Total Leads', value: total },
    { label: 'Closed (Qualified)', value: closed.length },
    { label: 'Revenue Generated', value: formatCurrency(revenue) },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
    </div>
  )
}
