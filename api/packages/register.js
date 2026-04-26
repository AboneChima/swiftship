import prisma from '../_prisma.js'
import { sendPackageRegistrationEmail } from '../_emailService.js'

function generateTrackingNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
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
        shippingCost: parseFloat(shipping_cost),
        clearanceCost: parseFloat(clearance_cost),
        collectionDate: collection_date,
        deliveryDate: delivery_date,
        arrivalDate: arrival_date,
        status: 'pending'
      }
    })

    // Send email notification (don't wait for it)
    if (pkg.receiverEmail) {
      sendPackageRegistrationEmail(toSnakeCase(pkg)).catch(err => {
        console.error('Failed to send email:', err)
      })
    }

    res.status(201).json(toSnakeCase(pkg))
  } catch (err) {
    console.error('Register package error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
