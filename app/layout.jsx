import './globals.css'
import { auth } from '@/lib/auth'
import SignOutButton from '@/app/components/SignOutButton'

export const metadata = {
  title: 'Marketing Agency CRM',
  description: 'Leads management for your marketing agency',
}

export default async function RootLayout({ children }) {
  const session = await auth()

  return (
    <html lang="en">
      <body>
        <nav style={{
          background: '#1e40af', color: '#fff',
          padding: '0 2rem', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}>
          <a href="/leads" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Agency CRM</a>
          {session && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
              <span style={{ opacity: 0.75 }}>{session.user?.name}</span>
              <SignOutButton />
            </div>
          )}
        </nav>
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
