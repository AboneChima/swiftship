import pg from 'pg'
import Database from 'better-sqlite3'

const { Pool } = pg
const isProduction = process.env.NODE_ENV === 'production'

async function migrate() {
  if (isProduction) {
    const db = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false }
    })

    try {
      // Add new columns to packages table
      await db.query(`
        ALTER TABLE packages 
        ADD COLUMN IF NOT EXISTS sender_phone TEXT,
        ADD COLUMN IF NOT EXISTS sender_id TEXT,
        ADD COLUMN IF NOT EXISTS sender_country TEXT,
        ADD COLUMN IF NOT EXISTS receiver_phone TEXT,
        ADD COLUMN IF NOT EXISTS receiver_country TEXT,
        ADD COLUMN IF NOT EXISTS product_name TEXT,
        ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2),
        ADD COLUMN IF NOT EXISTS clearance_cost DECIMAL(10,2),
        ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10,2),
        ADD COLUMN IF NOT EXISTS collection_date DATE,
        ADD COLUMN IF NOT EXISTS collection_time TIME,
        ADD COLUMN IF NOT EXISTS delivery_date DATE,
        ADD COLUMN IF NOT EXISTS arrival_date DATE,
        ADD COLUMN IF NOT EXISTS customer_email TEXT
      `)
      
      console.log('PostgreSQL migration completed')
      await db.end()
    } catch (err) {
      console.error('Migration error:', err)
    }
  } else {
    const db = new Database('swiftship.db')
    
    try {
      // SQLite doesn't support multiple ADD COLUMN in one statement
      const columns = [
        'sender_phone TEXT',
        'sender_id TEXT',
        'sender_country TEXT',
        'receiver_phone TEXT',
        'receiver_country TEXT',
        'product_name TEXT',
        'shipping_cost REAL',
        'clearance_cost REAL',
        'total_cost REAL',
        'collection_date TEXT',
        'collection_time TEXT',
        'delivery_date TEXT',
        'arrival_date TEXT',
        'customer_email TEXT'
      ]

      for (const column of columns) {
        try {
          db.exec(`ALTER TABLE packages ADD COLUMN ${column}`)
        } catch (err) {
          // Column might already exist
          if (!err.message.includes('duplicate column name')) {
            throw err
          }
        }
      }
      
      console.log('SQLite migration completed')
      db.close()
    } catch (err) {
      console.error('Migration error:', err)
    }
  }
}

migrate()
