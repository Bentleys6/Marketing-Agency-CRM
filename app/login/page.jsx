'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

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
  const [error, formAction, pending] = useActionState(loginAction, null)

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

        <form action={formAction} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Email
            </label>
            <input
              type="email" name="email"
              placeholder="you@agency.com" required style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password" name="password"
              placeholder="••••••••" required style={inputStyle}
            />
          </div>
          <button type="submit" disabled={pending} style={{
            background: '#1e40af', color: '#fff', padding: '0.75rem',
            border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem',
            cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.7 : 1,
            marginTop: '0.25rem',
          }}>
            {pending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
