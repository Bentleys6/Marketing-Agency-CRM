import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'crm.db')

let db

function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        status TEXT NOT NULL DEFAULT 'New',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
  }
  return db
}

export default getDb
