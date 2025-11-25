import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' })
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)
  const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword)

  const token = jwt.sign({ userId: result.lastInsertRowid }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' })

  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(result.lastInsertRowid)

  res.json({ token, user })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields required' })
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const validPassword = bcrypt.compareSync(password, user.password)
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' })

  const { password: _, ...userWithoutPassword } = user

  res.json({ token, user: userWithoutPassword })
})

router.get('/me', authenticateToken, (req, res) => {
  res.json(req.user)
})

export default router
