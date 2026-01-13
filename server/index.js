import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import packageRoutes from './routes/packages.js'
import adminRoutes from './routes/admin.js'
import { initDatabase } from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

console.log('Starting server initialization...')
console.log('Environment:', process.env.NODE_ENV)
console.log('Port:', PORT)

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://swiftship-jpb6svlz0-oracles-projects-0d30db20.vercel.app',
    'https://swiftshipexpress.live',
    'https://www.swiftshipexpress.live'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

console.log('Initializing database...')
initDatabase().then(() => {
  console.log('Database initialized successfully')
}).catch(err => {
  console.error('Database initialization error:', err)
})

app.use('/api/auth', authRoutes)
app.use('/api/packages', packageRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Server is ready to accept connections')
})
