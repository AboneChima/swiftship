import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../_prisma.js'

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

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const validPassword = bcrypt.compareSync(password, user.password)
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET || 'your-secret-key', 
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({ token, user: userWithoutPassword })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
