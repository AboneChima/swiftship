import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@swiftship.com' }
  })

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@swiftship.com',
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log('✅ Admin user created:', admin.email)
  } else {
    console.log('✅ Admin user already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
