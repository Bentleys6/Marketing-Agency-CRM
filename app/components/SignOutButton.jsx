'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      style={{
        background: 'rgba(255,255,255,0.15)', color: '#fff',
        border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px',
        padding: '0.3rem 0.75rem', fontSize: '0.8rem',
        cursor: 'pointer', fontWeight: 600,
      }}
    >
      Sign out
    </button>
  )
}
