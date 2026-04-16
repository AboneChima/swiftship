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
    where: { id: decoded.userId }
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

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await authenticateAdmin(req)
  } catch (err) {
    return res.status(401).json({ message: err.message })
  }

  try {
    // Delete all users except admin
    const result = await prisma.user.deleteMany({
      where: {
        email: {
          not: 'admin@swiftship.com'
        }
      }
    })

    res.status(200).json({ 
      message: `Deleted ${result.count} users (kept admin)`,
      count: result.count
    })
  } catch (err) {
    console.error('Clear users error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
