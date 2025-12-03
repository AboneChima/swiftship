import express from 'express'
import { query } from '../db.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'
import { sendCustomEmail } from '../services/emailService.js'

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

// Send email to user
router.post('/send-email', authenticateToken, isAdmin, async (req, res) => {
  const { userId, subject, message } = req.body

  if (!userId || !subject || !message) {
    return res.status(400).json({ message: 'User, subject, and message are required' })
  }

  try {
    // Get user details
    const userResult = await query('SELECT name, email FROM users WHERE id = $1', [userId])
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const user = userResult.rows[0]
    
    // Send email
    const result = await sendCustomEmail(user.email, user.name, subject, message)
    
    if (result.success) {
      res.json({ message: 'Email sent successfully', messageId: result.messageId })
    } else {
      res.status(500).json({ message: 'Failed to send email', error: result.error })
    }
  } catch (err) {
    console.error('Send email error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
