import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'

const db = new Database('swiftship.db')

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_number TEXT UNIQUE NOT NULL,
      sender_name TEXT NOT NULL,
      sender_location TEXT NOT NULL,
      receiver_name TEXT NOT NULL,
      receiver_location TEXT NOT NULL,
      weight REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS tracking_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (package_id) REFERENCES packages(id)
    )
  `)

  const adminExists = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@swiftship.com')
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Admin User',
      'admin@swiftship.com',
      hashedPassword,
      'admin'
    )
    console.log('Default admin created: admin@swiftship.com / admin123')
  }

  console.log('Database initialized')
}

export default db
