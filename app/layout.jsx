import './globals.css'

export const metadata = {
  title: 'Marketing Agency CRM',
  description: 'Leads management for your marketing agency',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          background: '#1e40af',
          color: '#fff',
          padding: '0 2rem',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
        }}>
          <a href="/" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
            Agency CRM
          </a>
          <a href="/leads" style={{ fontSize: '0.9rem', opacity: 0.85 }}>
            Leads
          </a>
        </nav>
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
