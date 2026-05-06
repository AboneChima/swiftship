import jwt from 'jsonwebtoken'
import prisma from '../_prisma.js'
import { sendPackageRegistrationEmail } from '../_emailService.js'

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

// Convert Prisma camelCase to snake_case for frontend
function toSnakeCase(pkg) {
  return {
    id: pkg.id,
    tracking_number: pkg.trackingNumber,
    sender_name: pkg.senderName,
    sender_phone: pkg.senderPhone,
    sender_id: pkg.senderId,
    sender_email: pkg.senderEmail,
    sender_country: pkg.senderCountry,
    sender_location: pkg.senderLocation,
    receiver_name: pkg.receiverName,
    receiver_phone: pkg.receiverPhone,
    receiver_email: pkg.receiverEmail,
    receiver_country: pkg.receiverCountry,
    receiver_location: pkg.receiverLocation,
    product_name: pkg.productName,
    weight: pkg.weight,
    status: pkg.status,
    shipping_cost: pkg.shippingCost,
    clearance_cost: pkg.clearanceCost,
    collection_date: pkg.collectionDate,
    delivery_date: pkg.deliveryDate,
    arrival_date: pkg.arrivalDate,
    user_id: pkg.userId,
    created_at: pkg.createdAt
  }
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

  // Handle GET - list all packages
  if (req.method === 'GET') {
    try {
      const packages = await prisma.package.findMany({
        orderBy: { createdAt: 'desc' }
      })
      res.status(200).json(packages.map(toSnakeCase))
    } catch (err) {
      console.error('Get packages error:', err)
      res.status(500).json({ message: 'Server error' })
    }
  } 
  // Handle POST - create new package
  else if (req.method === 'POST') {
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

      // Send email notification (don't wait for it)
      if (pkg.receiverEmail) {
        console.log('Sending email notification to receiver:', pkg.receiverEmail)
        sendPackageRegistrationEmail(toSnakeCase(pkg)).catch(err => {
          console.error('Failed to send email:', err)
        })
      } else {
        console.log('No receiver email provided, skipping email notification')
      }

      res.status(201).json(toSnakeCase(pkg))
    } catch (err) {
      console.error('Create package error:', err)
      console.error('Error details:', err.message, err.stack)
      res.status(500).json({ message: 'Server error', error: err.message })
    }
  }
  // Handle PUT - update package
  else if (req.method === 'PUT') {
    const { id } = req.query
    const updates = req.body

    if (!id) {
      return res.status(400).json({ message: 'Package ID required' })
    }

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

      // Send email notification on update if receiver email exists
      if (pkg.receiverEmail) {
        console.log('Sending email notification to updated receiver:', pkg.receiverEmail)
        sendPackageRegistrationEmail(toSnakeCase(pkg)).catch(err => {
          console.error('Failed to send email on update:', err)
        })
      }

      res.status(200).json(toSnakeCase(pkg))
    } catch (err) {
      console.error('Update package error:', err)
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Package not found' })
      }
      res.status(500).json({ message: 'Server error' })
    }
  }
  // Handle DELETE - delete package
  else if (req.method === 'DELETE') {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Package ID required' })
    }

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
  }
  else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
