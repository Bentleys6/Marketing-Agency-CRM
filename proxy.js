import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import authConfig from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname === '/login'
  const isSetupPage = req.nextUrl.pathname === '/setup'

  if (!isLoggedIn && !isLoginPage && !isSetupPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/leads', req.url))
  }
})

export const config = {
  matcher: ['/((?!api/auth|api/admin|_next/static|_next/image|favicon.ico).*)'],
}
