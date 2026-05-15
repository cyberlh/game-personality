import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = resolve(__dirname, '..', 'data.db')

let db

export async function initDB() {
  const SQL = await initSqlJs()
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS results (
      id TEXT PRIMARY KEY,
      answers TEXT NOT NULL,
      scores TEXT NOT NULL,
      result_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  saveDB()
}

function saveDB() {
  const data = db.export()
  const buffer = Buffer.from(data)
  writeFileSync(DB_PATH, buffer)
}

export function saveResult(id, answers, scores, resultType) {
  const stmt = db.prepare(
    'INSERT INTO results (id, answers, scores, result_type) VALUES (?, ?, ?, ?)'
  )
  stmt.run([id, JSON.stringify(answers), JSON.stringify(scores), resultType])
  stmt.free()
  saveDB()
}

export function getResult(id) {
  const stmt = db.prepare('SELECT * FROM results WHERE id = ?')
  const row = stmt.getAsObject([id])
  stmt.free()
  if (!row || !row.id) return null
  return {
    ...row,
    answers: JSON.parse(row.answers),
    scores: JSON.parse(row.scores)
  }
}

export function getStats() {
  const totalRow = db.exec('SELECT COUNT(*) as count FROM results')
  const total = totalRow.length > 0 ? totalRow[0].values[0][0] : 0
  const counts = {}
  const rows = db.exec('SELECT result_type, COUNT(*) as count FROM results GROUP BY result_type')
  if (rows.length > 0) {
    rows[0].values.forEach(row => {
      counts[row[0]] = row[1]
    })
  }
  return { total, counts }
}
