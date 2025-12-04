import express from 'express'
import { query } from '../db.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'
import { sendPackageRegistrationEmail } from '../services/emailService.js'

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
    // Case-insensitive search
    const pkgResult = await query('SELECT * FROM packages WHERE LOWER(tracking_number) = LOWER($1)', [req.params.trackingNumber])
    
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
  const {
    tracking_number, sender_name, sender_phone, sender_id, sender_email, sender_country, sender_location,
    receiver_name, receiver_phone, receiver_email, receiver_country, receiver_location,
    product_name, weight, shipping_cost, clearance_cost,
    collection_date, collection_time, delivery_date, arrival_date, status
  } = req.body

  try {
    const result = await query(
      `INSERT INTO packages (
        tracking_number, sender_name, sender_phone, sender_id, sender_email, sender_country, sender_location,
        receiver_name, receiver_phone, receiver_email, receiver_country, receiver_location,
        product_name, weight, shipping_cost, clearance_cost,
        collection_date, collection_time, delivery_date, arrival_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`,
      [
        tracking_number, sender_name, sender_phone, sender_id, sender_email, sender_country, sender_location,
        receiver_name, receiver_phone, receiver_email, receiver_country, receiver_location,
        product_name, weight, shipping_cost || 0, clearance_cost || 0,
        collection_date, collection_time, delivery_date, arrival_date, status || 'pending'
      ]
    )

    const newPackage = result.rows[0]
    await query('INSERT INTO tracking_history (package_id, status) VALUES ($1, $2)', [newPackage.id, status || 'pending'])

    // Send package registration email to receiver
    sendPackageRegistrationEmail(newPackage).catch(err => {
      console.error('Failed to send package registration email:', err)
    })

    res.json({ message: 'Package created', id: newPackage.id })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const {
    tracking_number, sender_name, sender_phone, sender_id, sender_email, sender_country, sender_location,
    receiver_name, receiver_phone, receiver_email, receiver_country, receiver_location,
    product_name, weight, shipping_cost, clearance_cost,
    collection_date, collection_time, delivery_date, arrival_date, status
  } = req.body

  try {
    const oldPackageResult = await query('SELECT * FROM packages WHERE id = $1', [req.params.id])
    
    if (oldPackageResult.rows.length === 0) {
      return res.status(404).json({ message: 'Package not found' })
    }

    const oldPackage = oldPackageResult.rows[0]

    await query(
      `UPDATE packages SET 
        tracking_number = $1, sender_name = $2, sender_phone = $3, sender_id = $4, sender_email = $5, 
        sender_country = $6, sender_location = $7, receiver_name = $8, receiver_phone = $9, receiver_email = $10,
        receiver_country = $11, receiver_location = $12, product_name = $13, weight = $14, 
        shipping_cost = $15, clearance_cost = $16, collection_date = $17, collection_time = $18,
        delivery_date = $19, arrival_date = $20, status = $21 
      WHERE id = $22`,
      [
        tracking_number, sender_name, sender_phone, sender_id, sender_email, sender_country, sender_location,
        receiver_name, receiver_phone, receiver_email, receiver_country, receiver_location,
        product_name, weight, shipping_cost || 0, clearance_cost || 0,
        collection_date, collection_time, delivery_date, arrival_date, status, req.params.id
      ]
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
