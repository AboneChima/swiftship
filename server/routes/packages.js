import express from 'express'
import { query } from '../db.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM packages ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/my-packages', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM packages WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id])
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const pkgResult = await query('SELECT * FROM packages WHERE tracking_number = $1', [req.params.trackingNumber])
    
    if (pkgResult.rows.length === 0) {
      return res.status(404).json({ message: 'Package not found' })
    }

    const pkg = pkgResult.rows[0]
    const historyResult = await query('SELECT * FROM tracking_history WHERE package_id = $1 ORDER BY timestamp DESC', [pkg.id])

    res.json({ ...pkg, history: historyResult.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status } = req.body

  try {
    const result = await query(
      'INSERT INTO packages (tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status || 'pending']
    )

    const packageId = result.rows[0].id
    await query('INSERT INTO tracking_history (package_id, status) VALUES ($1, $2)', [packageId, status || 'pending'])

    res.json({ message: 'Package created', id: packageId })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status } = req.body

  try {
    const oldPackageResult = await query('SELECT * FROM packages WHERE id = $1', [req.params.id])
    
    if (oldPackageResult.rows.length === 0) {
      return res.status(404).json({ message: 'Package not found' })
    }

    const oldPackage = oldPackageResult.rows[0]

    await query(
      'UPDATE packages SET tracking_number = $1, sender_name = $2, sender_location = $3, receiver_name = $4, receiver_location = $5, weight = $6, status = $7 WHERE id = $8',
      [tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status, req.params.id]
    )

    if (oldPackage.status !== status) {
      await query('INSERT INTO tracking_history (package_id, status) VALUES ($1, $2)', [req.params.id, status])
    }

    res.json({ message: 'Package updated' })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await query('DELETE FROM tracking_history WHERE package_id = $1', [req.params.id])
    await query('DELETE FROM packages WHERE id = $1', [req.params.id])
    res.json({ message: 'Package deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
