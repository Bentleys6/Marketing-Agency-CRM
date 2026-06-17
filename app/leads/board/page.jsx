'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { STATUSES, STATUS_COLORS } from '@/lib/leadStatus'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export default function BoardPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [dragId, setDragId] = useState(null)
  const [dragOverStatus, setDragOverStatus] = useState(null)
  const [activeTag, setActiveTag] = useState('All')

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => { setLeads(data); setLoading(false) })
  }, [])

  async function moveLead(id, status) {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)))
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  function handleDrop(e, status) {
    e.preventDefault()
    setDragOverStatus(null)
    if (dragId == null) return
    const lead = leads.find(l => l.id === dragId)
    if (lead && lead.status !== status) moveLead(dragId, status)
    setDragId(null)
  }

  const tags = [...new Set(leads.map(l => l.tag).filter(Boolean))].sort()
  const visibleLeads = activeTag === 'All' ? leads : leads.filter(l => l.tag === activeTag)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <Link href="/leads" style={{ color: '#64748b', fontSize: '0.85rem' }}>← Back to Leads</Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>Leads Board</h1>
        </div>
      </div>

      {!loading && tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {['All', ...tags].map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                background: activeTag === tag ? '#1e40af' : '#fff',
                color: activeTag === tag ? '#fff' : '#475569',
                border: '1px solid ' + (activeTag === tag ? '#1e40af' : '#cbd5e1'),
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {STATUSES.map(status => {
            const badge = STATUS_COLORS[status]
            const columnLeads = visibleLeads.filter(l => l.status === status)
            const columnRevenue = columnLeads.reduce((sum, l) => sum + (Number(l.revenue) || 0), 0)
            const isOver = dragOverStatus === status
            return (
              <div
                key={status}
                onDragOver={e => { e.preventDefault(); setDragOverStatus(status) }}
                onDragLeave={() => setDragOverStatus(prev => (prev === status ? null : prev))}
                onDrop={e => handleDrop(e, status)}
                style={{
                  background: isOver ? '#eff6ff' : '#f8fafc',
                  border: isOver ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  minWidth: '260px',
                  width: '260px',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'calc(100vh - 180px)',
                }}
              >
                <div style={{ padding: '0.9rem 1rem 0.6rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      background: badge.bg, color: badge.color,
                      padding: '0.2rem 0.65rem', borderRadius: '999px',
                      fontSize: '0.78rem', fontWeight: 600,
                    }}>
                      {status}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>{columnLeads.length}</span>
                  </div>
                  {columnRevenue > 0 && (
                    <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                      {formatCurrency(columnRevenue)}
                    </p>
                  )}
                </div>

                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto' }}>
                  {columnLeads.length === 0 ? (
                    <p style={{ color: '#cbd5e1', fontSize: '0.8rem', textAlign: 'center', padding: '1rem 0' }}>No leads</p>
                  ) : columnLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => setDragId(lead.id)}
                      onDragEnd={() => setDragId(null)}
                      style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.7rem 0.8rem',
                        cursor: 'grab',
                        opacity: dragId === lead.id ? 0.5 : 1,
                      }}
                    >
                      <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.2rem' }}>{lead.name}</p>
                      {lead.company && (
                        <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '0.2rem' }}>{lead.company}</p>
                      )}
                      <p style={{ color: '#94a3b8', fontSize: '0.76rem' }}>{lead.email}</p>
                      {lead.tag && (
                        <span style={{
                          display: 'inline-block', marginTop: '0.3rem',
                          background: '#f1f5f9', color: '#475569',
                          padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
                        }}>
                          {lead.tag}
                        </span>
                      )}
                      {Number(lead.revenue) > 0 && (
                        <p style={{ color: '#166534', fontSize: '0.78rem', fontWeight: 600, marginTop: '0.3rem' }}>
                          {formatCurrency(lead.revenue)}
                        </p>
                      )}
                      <Link href={`/leads/${lead.id}/edit`} style={{
                        color: '#1e40af', fontWeight: 600, fontSize: '0.76rem', marginTop: '0.4rem', display: 'inline-block',
                      }}>
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
