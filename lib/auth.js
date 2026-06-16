import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import getDb from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const db = getDb()
        const result = await db.execute({
          sql: 'SELECT * FROM users WHERE email = ?',
          args: [credentials.email],
        })

        const user = result.rows[0]
        if (!user) return null

        const valid = await bcrypt.compare(String(credentials.password), String(user.password))
        if (!valid) return null

        return { id: String(user.id), name: user.name, email: user.email }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
})
