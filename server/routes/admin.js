import express from 'express'
import { query } from '../db.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
