import { sql } from '../_db.js'

function generateTrackingNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

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
    const tracking_number = generateTrackingNumber()

    const result = await sql`
      INSERT INTO packages (
        tracking_number, sender_name, sender_phone, sender_id, sender_email, sender_country,
        sender_location, receiver_name, receiver_phone, receiver_email, receiver_country,
        receiver_location, product_name, weight, shipping_cost, clearance_cost,
        collection_date, delivery_date, arrival_date, status
      ) VALUES (
        ${tracking_number}, ${sender_name}, ${sender_phone}, ${sender_id}, ${sender_email}, 
        ${sender_country}, ${sender_location}, ${receiver_name}, ${receiver_phone}, 
        ${receiver_email}, ${receiver_country}, ${receiver_location}, ${product_name}, 
        ${weight}, ${shipping_cost}, ${clearance_cost}, ${collection_date}, ${delivery_date}, 
        ${arrival_date}, 'pending'
      ) RETURNING *
    `

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Register package error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
