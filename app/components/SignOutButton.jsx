'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      style={{
        background: 'rgba(147,51,234,0.18)', color: '#e9d5ff',
        border: '1px solid #9333ea', borderRadius: '6px',
        padding: '0.3rem 0.75rem', fontSize: '0.8rem',
        cursor: 'pointer', fontWeight: 600,
      }}
    >
      Sign out
    </button>
  )
}
