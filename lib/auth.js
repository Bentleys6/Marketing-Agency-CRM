import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import getDb from '@/lib/db'
import authConfig from '@/lib/auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const db = getDb()
          const queryPromise = db.execute({
            sql: 'SELECT * FROM users WHERE email = ?',
            args: [credentials.email],
          })
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database query timed out')), 8000)
          )
          const result = await Promise.race([queryPromise, timeoutPromise])

          const user = result.rows[0]
          if (!user) return null

          const valid = await bcrypt.compare(String(credentials.password), String(user.password))
          if (!valid) return null

          return { id: String(user.id), name: user.name, email: user.email }
        } catch (err) {
          console.error('authorize() failed:', err)
          return null
        }
      },
    }),
  ],
})
