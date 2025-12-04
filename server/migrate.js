import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

async function migrate() {
  try {
    console.log('Starting migration...')

    // Add new columns to packages table
    const alterQueries = [
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS sender_phone TEXT DEFAULT ''`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS sender_id TEXT DEFAULT ''`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS sender_email TEXT DEFAULT ''`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS sender_country TEXT DEFAULT ''`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS receiver_phone TEXT DEFAULT ''`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS receiver_email TEXT DEFAULT ''`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS receiver_country TEXT DEFAULT ''`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS product_name TEXT DEFAULT 'Package'`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS shipping_cost REAL DEFAULT 0`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS clearance_cost REAL DEFAULT 0`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS collection_date DATE`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS collection_time TEXT`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS delivery_date DATE`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS arrival_date DATE`,
    ]

    for (const query of alterQueries) {
      await db.query(query)
      console.log('✓', query.substring(0, 60) + '...')
    }

    console.log('Migration completed successfully!')
    process.exit(0)
  } catch (err) {
    console.error('Migration error:', err)
    process.exit(1)
  }
}

migrate()
