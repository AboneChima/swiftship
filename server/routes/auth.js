import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db, { query } from '../db.js'
import { authenticateToken } from '../middleware/auth.js'
import { sendWelcomeEmail } from '../services/emailService.js'

const router = express.Router()
const isProduction = process.env.NODE_ENV === 'production'

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' })
  }

  try {
    // Check if user exists
    const existingUserResult = await query('SELECT * FROM users WHERE email = $1', [email])
    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    
    // Insert new user
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    )

    const userId = result.rows[0].id
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' })

    // Get user without password
    const userResult = await query('SELECT id, name, email, role FROM users WHERE id = $1', [userId])
    const user = userResult.rows[0]

    // Send welcome email (don't wait for it to complete)
    sendWelcomeEmail(email, name).catch(err => {
      console.error('Failed to send welcome email:', err)
    })

    res.json({ token, user })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields required' })
  }

  try {
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email])
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const user = userResult.rows[0]
    const validPassword = bcrypt.compareSync(password, user.password)
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' })

    const { password: _, ...userWithoutPassword } = user

    res.json({ token, user: userWithoutPassword })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', authenticateToken, (req, res) => {
  res.json(req.user)
})

export default router
