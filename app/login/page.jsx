'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  fontSize: '0.95rem',
  outline: 'none',
  background: '#fff',
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.ok) {
        router.push('/leads')
      } else {
        setError(res?.error ? `Sign in failed: ${res.error}` : 'Incorrect email or password.')
        setLoading(false)
      }
    } catch (err) {
      setError(`Something went wrong: ${err?.message || 'unknown error'}`)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f8fafc',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0',
        padding: '2.5rem', width: '100%', maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Agency CRM
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem',
            borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@agency.com" required style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required style={inputStyle}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            background: '#1e40af', color: '#fff', padding: '0.75rem',
            border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            marginTop: '0.25rem',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
