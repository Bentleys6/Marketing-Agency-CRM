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
          background: '#150f20', color: '#f4f1fa',
          padding: '0 2rem', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #2c2340',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="/leads" style={{ fontWeight: 700, fontSize: '1.1rem', color: '#c084fc' }}>Agency CRM</a>
          </div>
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
