import express from 'express'
import db from '../db.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/users', authenticateToken, isAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all()
  res.json(users)
})

export default router
