import express from 'express'
import multer from 'multer'
import { query } from '../db.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'
import { sendCustomEmail } from '../services/emailService.js'

const router = express.Router()

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'))
    }
  }
})

router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Send email with optional attachment
router.post('/send-email', authenticateToken, isAdmin, upload.single('attachment'), async (req, res) => {
  const { recipientEmail, recipientName, subject, message } = req.body

  if (!recipientEmail || !recipientName || !subject || !message) {
    return res.status(400).json({ message: 'Recipient email, name, subject, and message are required' })
  }

  try {
    // Prepare attachment if file was uploaded
    let attachment = null
    if (req.file) {
      attachment = {
        content: req.file.buffer.toString('base64'),
        filename: req.file.originalname
      }
    }
    
    // Send email
    const result = await sendCustomEmail(recipientEmail, recipientName, subject, message, attachment)
    
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

// Delete user
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id

  try {
    // Prevent admin from deleting themselves
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }

    // Check if user exists
    const userResult = await query('SELECT id FROM users WHERE id = $1', [userId])
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Delete user permanently
    await query('DELETE FROM users WHERE id = $1', [userId])
    
    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error('Delete user error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
