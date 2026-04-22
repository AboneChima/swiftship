import prisma from '../_prisma.js'

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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { tracking } = req.query

  if (!tracking) {
    return res.status(400).json({ message: 'Tracking number required' })
  }

  try {
    const pkg = await prisma.package.findFirst({
      where: {
        trackingNumber: {
          equals: tracking,
          mode: 'insensitive'
        }
      }
    })

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' })
    }

    res.status(200).json(toSnakeCase(pkg))
  } catch (err) {
    console.error('Track error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
