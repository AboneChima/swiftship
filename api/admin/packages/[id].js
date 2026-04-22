import jwt from 'jsonwebtoken'
import prisma from '../../_prisma.js'

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

  const { id } = req.query

  if (req.method === 'PUT') {
    const updates = req.body

    try {
      const pkg = await prisma.package.update({
        where: { id: parseInt(id) },
        data: {
          senderName: updates.sender_name,
          senderPhone: updates.sender_phone || '',
          senderId: updates.sender_id || '',
          senderEmail: updates.sender_email || '',
          senderCountry: updates.sender_country || '',
          senderLocation: updates.sender_location,
          receiverName: updates.receiver_name,
          receiverPhone: updates.receiver_phone || '',
          receiverEmail: updates.receiver_email || '',
          receiverCountry: updates.receiver_country || '',
          receiverLocation: updates.receiver_location,
          productName: updates.product_name || '',
          weight: parseFloat(updates.weight),
          status: updates.status,
          shippingCost: parseFloat(updates.shipping_cost) || 0,
          clearanceCost: parseFloat(updates.clearance_cost) || 0,
          collectionDate: updates.collection_date || '',
          deliveryDate: updates.delivery_date || '',
          arrivalDate: updates.arrival_date || ''
        }
      })

      res.status(200).json(pkg)
    } catch (err) {
      console.error('Update package error:', err)
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Package not found' })
      }
      res.status(500).json({ message: 'Server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.package.delete({
        where: { id: parseInt(id) }
      })

      res.status(200).json({ message: 'Package deleted' })
    } catch (err) {
      console.error('Delete package error:', err)
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Package not found' })
      }
      res.status(500).json({ message: 'Server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
