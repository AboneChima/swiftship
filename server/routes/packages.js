import express from 'express'
import db from '../db.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, isAdmin, (req, res) => {
  const packages = db.prepare('SELECT * FROM packages ORDER BY created_at DESC').all()
  res.json(packages)
})

router.get('/my-packages', authenticateToken, (req, res) => {
  const packages = db.prepare('SELECT * FROM packages WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id)
  res.json(packages)
})

router.get('/track/:trackingNumber', (req, res) => {
  const pkg = db.prepare('SELECT * FROM packages WHERE tracking_number = ?').get(req.params.trackingNumber)
  
  if (!pkg) {
    return res.status(404).json({ message: 'Package not found' })
  }

  const history = db.prepare('SELECT * FROM tracking_history WHERE package_id = ? ORDER BY timestamp DESC').all(pkg.id)

  res.json({ ...pkg, history })
})

router.post('/', authenticateToken, isAdmin, (req, res) => {
  const { tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status } = req.body

  if (!tracking_number || !sender_name || !sender_location || !receiver_name || !receiver_location || !weight) {
    return res.status(400).json({ message: 'All fields required' })
  }

  try {
    const result = db.prepare(`
      INSERT INTO packages (tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status || 'pending')

    db.prepare('INSERT INTO tracking_history (package_id, status) VALUES (?, ?)').run(result.lastInsertRowid, status || 'pending')

    res.json({ message: 'Package created', id: result.lastInsertRowid })
  } catch (err) {
    res.status(400).json({ message: 'Tracking number already exists' })
  }
})

router.put('/:id', authenticateToken, isAdmin, (req, res) => {
  const { tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status } = req.body

  const oldPackage = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id)
  if (!oldPackage) {
    return res.status(404).json({ message: 'Package not found' })
  }

  db.prepare(`
    UPDATE packages 
    SET tracking_number = ?, sender_name = ?, sender_location = ?, receiver_name = ?, receiver_location = ?, weight = ?, status = ?
    WHERE id = ?
  `).run(tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status, req.params.id)

  if (oldPackage.status !== status) {
    db.prepare('INSERT INTO tracking_history (package_id, status) VALUES (?, ?)').run(req.params.id, status)
  }

  res.json({ message: 'Package updated' })
})

router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  db.prepare('DELETE FROM tracking_history WHERE package_id = ?').run(req.params.id)
  db.prepare('DELETE FROM packages WHERE id = ?').run(req.params.id)
  res.json({ message: 'Package deleted' })
})

export default router
