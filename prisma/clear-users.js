import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete all users except admin
  const result = await prisma.user.deleteMany({
    where: {
      email: {
        not: 'admin@swiftship.com'
      }
    }
  })

  console.log(`✅ Deleted ${result.count} users (kept admin)`)
  
  // Show remaining users
  const remainingUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  })
  
  console.log('\nRemaining users:')
  console.table(remainingUsers)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
