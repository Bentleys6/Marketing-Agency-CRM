'use client'

import { useState } from 'react'

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  fontSize: '0.95rem',
  outline: 'none',
  background: '#fff',
}

export default function SetupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secret, setSecret] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-init-secret': secret,
        },
        body: JSON.stringify({ name, email, password }),
      })
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        setMessage(`Error (status ${res.status}): ${text || 'empty response from server'}`)
        setLoading(false)
        return
      }

      if (res.ok) {
        setMessage(`Success: ${data.message}`)
      } else {
        setMessage(`Error: ${data.error || 'Something went wrong'}`)
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f8fafc',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0',
        padding: '2.5rem', width: '100%', maxWidth: '420px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Create / Reset Account
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Creates a new login, or resets the password if the email already exists.
        </p>

        {message && (
          <div style={{
            background: message.startsWith('Success') ? '#dcfce7' : '#fee2e2',
            color: message.startsWith('Success') ? '#166534' : '#991b1b',
            padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem',
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>Setup Key</label>
            <input type="password" value={secret} onChange={e => setSecret(e.target.value)} required style={inputStyle} />
          </div>
          <button type="submit" disabled={loading} style={{
            background: '#1e40af', color: '#fff', padding: '0.75rem',
            border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            marginTop: '0.25rem',
          }}>
            {loading ? 'Saving...' : 'Save Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
