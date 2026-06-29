import Link from 'next/link'
import { colors } from '@/lib/theme'

export default function Home() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: colors.text }}>
        Marketing Agency CRM
      </h1>
      <p style={{ color: colors.textMuted, marginBottom: '2rem' }}>
        Manage your leads and clients in one place.
      </p>
      <Link href="/leads" style={{
        background: colors.primary,
        color: '#fff',
        padding: '0.75rem 2rem',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '0.95rem',
      }}>
        View Leads
      </Link>
    </div>
  )
}
