import { PrismaClient } from '@prisma/client'

// Prevent multiple instances in serverless
const globalForPrisma = global

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn']
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
