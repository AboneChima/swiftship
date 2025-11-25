import pg from 'pg'
import bcrypt from 'bcryptjs'

const { Pool } = pg

// Use PostgreSQL for production, SQLite for development
const isProduction = process.env.NODE_ENV === 'production'

let db

if (isProduction) {
  // PostgreSQL for production
  db = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  // SQLite for development
  const Database = await import('better-sqlite3')
  db = new Database.default('swiftship.db')
}

export async function initDatabase() {
  if (isProduction) {
    // PostgreSQL initialization
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await db.query(`
        CREATE TABLE IF NOT EXISTS packages (
          id SERIAL PRIMARY KEY,
          tracking_number TEXT UNIQUE NOT NULL,
          sender_name TEXT NOT NULL,
          sender_location TEXT NOT NULL,
          receiver_name TEXT NOT NULL,
          receiver_location TEXT NOT NULL,
          weight REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          user_id INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await db.query(`
        CREATE TABLE IF NOT EXISTS tracking_history (
          id SERIAL PRIMARY KEY,
          package_id INTEGER NOT NULL REFERENCES packages(id),
          status TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Create default admin
      const adminCheck = await db.query('SELECT * FROM users WHERE email = $1', ['admin@swiftship.com'])
      if (adminCheck.rows.length === 0) {
        const hashedPassword = bcrypt.hashSync('admin123', 10)
        await db.query(
          'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
          ['Admin User', 'admin@swiftship.com', hashedPassword, 'admin']
        )
        console.log('Default admin created: admin@swiftship.com / admin123')
      }

      console.log('PostgreSQL Database initialized')
    } catch (err) {
      console.error('Database initialization error:', err)
    }
  } else {
    // SQLite initialization (development)
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

    console.log('SQLite Database initialized')
  }
}

// Helper function to execute queries (works for both SQLite and PostgreSQL)
export function query(sql, params = []) {
  if (isProduction) {
    return db.query(sql, params)
  } else {
    if (sql.includes('SELECT')) {
      return { rows: db.prepare(sql.replace(/\$\d+/g, '?')).all(...params) }
    } else {
      const result = db.prepare(sql.replace(/\$\d+/g, '?')).run(...params)
      return { rows: [{ id: result.lastInsertRowid }], rowCount: result.changes }
    }
  }
}

export default db
