import jwt from 'jsonwebtoken'
import { sql } from '../../_db.js'

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

  const { id } = req.query

  if (req.method === 'PUT') {
    const updates = req.body

    try {
      const result = await sql`
        UPDATE packages 
        SET 
          sender_name = ${updates.sender_name},
          sender_phone = ${updates.sender_phone || ''},
          sender_id = ${updates.sender_id || ''},
          sender_email = ${updates.sender_email || ''},
          sender_country = ${updates.sender_country || ''},
          sender_location = ${updates.sender_location},
          receiver_name = ${updates.receiver_name},
          receiver_phone = ${updates.receiver_phone || ''},
          receiver_email = ${updates.receiver_email || ''},
          receiver_country = ${updates.receiver_country || ''},
          receiver_location = ${updates.receiver_location},
          product_name = ${updates.product_name || ''},
          weight = ${updates.weight},
          status = ${updates.status},
          shipping_cost = ${updates.shipping_cost || 0},
          clearance_cost = ${updates.clearance_cost || 0},
          collection_date = ${updates.collection_date || ''},
          delivery_date = ${updates.delivery_date || ''},
          arrival_date = ${updates.arrival_date || ''}
        WHERE id = ${id}
        RETURNING *
      `

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Package not found' })
      }

      res.status(200).json(result.rows[0])
    } catch (err) {
      console.error('Update package error:', err)
      res.status(500).json({ message: 'Server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await sql`DELETE FROM packages WHERE id = ${id} RETURNING *`

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Package not found' })
      }

      res.status(200).json({ message: 'Package deleted' })
    } catch (err) {
      console.error('Delete package error:', err)
      res.status(500).json({ message: 'Server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
