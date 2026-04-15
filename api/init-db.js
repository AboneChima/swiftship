import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

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

    // Check if admin exists
    const adminCheck = await sql`SELECT * FROM users WHERE email = 'admin@swiftship.com'`
    
    if (adminCheck.rows.length === 0) {
      // Create default admin user
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      await sql`
        INSERT INTO users (name, email, password, role) 
        VALUES ('Admin', 'admin@swiftship.com', ${hashedPassword}, 'admin')
      `
    }

    res.status(200).json({ 
      message: 'Database initialized successfully',
      tables: ['users', 'packages'],
      admin: 'admin@swiftship.com / admin123'
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    res.status(500).json({ 
      message: 'Database initialization failed', 
      error: error.message 
    })
  }
}
