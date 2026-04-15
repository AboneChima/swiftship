import jwt from 'jsonwebtoken'
import { sql } from '../_db.js'

async function authenticateAdmin(req) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new Error('No token provided')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  const result = await sql`SELECT id, name, email, role FROM users WHERE id = ${decoded.userId}`

  if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return result.rows[0]
}

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

  try {
    await authenticateAdmin(req)
  } catch (err) {
    return res.status(401).json({ message: err.message })
  }

  if (req.method === 'GET') {
    try {
      const result = await sql`SELECT * FROM packages ORDER BY created_at DESC`
      res.status(200).json(result.rows)
    } catch (err) {
      console.error('Get packages error:', err)
      res.status(500).json({ message: 'Server error' })
    }
  } else if (req.method === 'POST') {
    const {
      sender_name,
      sender_phone = '',
      sender_id = '',
      sender_email = '',
      sender_country = '',
      sender_location,
      receiver_name,
      receiver_phone = '',
      receiver_email = '',
      receiver_country = '',
      receiver_location,
      product_name = '',
      weight,
      status = 'pending',
      shipping_cost = 0,
      clearance_cost = 0,
      collection_date = '',
      delivery_date = '',
      arrival_date = ''
    } = req.body

    if (!sender_name || !sender_location || !receiver_name || !receiver_location || !weight) {
      return res.status(400).json({ message: 'Required fields missing' })
    }

    try {
      const tracking_number = 'TRK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()

      const result = await sql`
        INSERT INTO packages (
          tracking_number, sender_name, sender_phone, sender_id, sender_email, sender_country,
          sender_location, receiver_name, receiver_phone, receiver_email, receiver_country,
          receiver_location, product_name, weight, status, shipping_cost, clearance_cost,
          collection_date, delivery_date, arrival_date
        ) VALUES (
          ${tracking_number}, ${sender_name}, ${sender_phone}, ${sender_id}, ${sender_email}, 
          ${sender_country}, ${sender_location}, ${receiver_name}, ${receiver_phone}, 
          ${receiver_email}, ${receiver_country}, ${receiver_location}, ${product_name}, 
          ${weight}, ${status}, ${shipping_cost}, ${clearance_cost}, ${collection_date}, 
          ${delivery_date}, ${arrival_date}
        ) RETURNING *
      `

      res.status(201).json(result.rows[0])
    } catch (err) {
      console.error('Create package error:', err)
      res.status(500).json({ message: 'Server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
