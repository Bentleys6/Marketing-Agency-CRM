'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  border: '1px solid #2c2340',
  borderRadius: '8px',
  fontSize: '0.95rem',
  outline: 'none',
  background: '#1d1530',
  color: '#f4f1fa',
}

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, null)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0b0710',
    }}>
      <div style={{
        background: '#150f20', borderRadius: '16px', border: '1px solid #2c2340',
        padding: '2.5rem', width: '100%', maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: '#c084fc' }}>
          Agency CRM
        </h1>
        <p style={{ color: '#b3a4d4', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{
            background: '#7f1d1d', color: '#fecaca', padding: '0.75rem 1rem',
            borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem',
          }}>
            {error}
          </div>
        )}

        <form action={formAction} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#b3a4d4' }}>
              Email
            </label>
            <input
              type="email" name="email"
              placeholder="you@agency.com" required style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#b3a4d4' }}>
              Password
            </label>
            <input
              type="password" name="password"
              placeholder="••••••••" required style={inputStyle}
            />
          </div>
          <button type="submit" disabled={pending} style={{
            background: '#9333ea', color: '#fff', padding: '0.75rem',
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
