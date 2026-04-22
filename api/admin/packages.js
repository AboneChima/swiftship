import jwt from 'jsonwebtoken'
import prisma from '../_prisma.js'

async function authenticateAdmin(req) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new Error('No token provided')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, name: true, email: true, role: true }
  })

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return user
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
      const packages = await prisma.package.findMany({
        orderBy: { createdAt: 'desc' }
      })
      res.status(200).json(packages)
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

      const pkg = await prisma.package.create({
        data: {
          trackingNumber: tracking_number,
          senderName: sender_name,
          senderPhone: sender_phone,
          senderId: sender_id,
          senderEmail: sender_email,
          senderCountry: sender_country,
          senderLocation: sender_location,
          receiverName: receiver_name,
          receiverPhone: receiver_phone,
          receiverEmail: receiver_email,
          receiverCountry: receiver_country,
          receiverLocation: receiver_location,
          productName: product_name,
          weight: parseFloat(weight),
          status,
          shippingCost: parseFloat(shipping_cost),
          clearanceCost: parseFloat(clearance_cost),
          collectionDate: collection_date,
          deliveryDate: delivery_date,
          arrivalDate: arrival_date
        }
      })

      res.status(201).json(pkg)
    } catch (err) {
      console.error('Create package error:', err)
      console.error('Error details:', err.message, err.stack)
      res.status(500).json({ message: 'Server error', error: err.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
