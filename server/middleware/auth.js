import jwt from 'jsonwebtoken'
import { query } from '../db.js'

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    const userResult = await query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.userId])
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = userResult.rows[0]
    next()
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' })
  }
}

export function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}
