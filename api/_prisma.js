import { PrismaClient } from '@prisma/client'

// Prevent multiple instances in serverless
const globalForPrisma = global

// Use DIRECT_URL if DATABASE_URL is not the correct one
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  log: ['error', 'warn']
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
