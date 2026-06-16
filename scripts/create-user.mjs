import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'

const [,, name, email, password] = process.argv

if (!name || !email || !password) {
  console.error('Usage: node scripts/create-user.mjs "Your Name" "you@email.com" "yourpassword"')
  process.exit(1)
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const hashed = await bcrypt.hash(password, 12)

await db.execute({
  sql: 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
  args: [name, email, hashed],
})

console.log(`✓ User created: ${name} (${email})`)
process.exit(0)
