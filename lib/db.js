import { createClient } from '@libsql/client'

function getDb() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
}

export async function initDb() {
  const db = getDb()
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      status TEXT NOT NULL DEFAULT 'New',
      revenue REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  try {
    await db.execute('ALTER TABLE leads ADD COLUMN revenue REAL NOT NULL DEFAULT 0')
  } catch (err) {
    if (!String(err.message).includes('duplicate column')) throw err
  }

  try {
    await db.execute("ALTER TABLE leads ADD COLUMN tag TEXT")
  } catch (err) {
    if (!String(err.message).includes('duplicate column')) throw err
  }

  try {
    await db.execute("ALTER TABLE leads ADD COLUMN assigned_to TEXT")
  } catch (err) {
    if (!String(err.message).includes('duplicate column')) throw err
  }

  const statusRemap = {
    New: 'Uncalled',
    Contacted: 'Called',
    Qualified: 'Closed',
    Lost: 'Unqualified',
  }
  for (const [oldStatus, newStatus] of Object.entries(statusRemap)) {
    await db.execute({
      sql: 'UPDATE leads SET status = ? WHERE status = ?',
      args: [newStatus, oldStatus],
    })
  }
}

export default getDb
