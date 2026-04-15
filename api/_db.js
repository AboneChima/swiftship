import { sql } from '@vercel/postgres'

export async function initDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create packages table
    await sql`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        tracking_number TEXT UNIQUE NOT NULL,
        sender_name TEXT NOT NULL,
        sender_phone TEXT DEFAULT '',
        sender_id TEXT DEFAULT '',
        sender_email TEXT DEFAULT '',
        sender_country TEXT DEFAULT '',
        sender_location TEXT NOT NULL,
        receiver_name TEXT NOT NULL,
        receiver_phone TEXT DEFAULT '',
        receiver_email TEXT DEFAULT '',
        receiver_country TEXT DEFAULT '',
        receiver_location TEXT NOT NULL,
        product_name TEXT DEFAULT '',
        weight REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        shipping_cost REAL DEFAULT 0,
        clearance_cost REAL DEFAULT 0,
        collection_date TEXT DEFAULT '',
        delivery_date TEXT DEFAULT '',
        arrival_date TEXT DEFAULT '',
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `

    console.log('Database tables initialized')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

export { sql }
