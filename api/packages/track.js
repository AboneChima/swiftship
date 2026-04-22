import prisma from '../_prisma.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { tracking } = req.query

  if (!tracking) {
    return res.status(400).json({ message: 'Tracking number required' })
  }

  try {
    const pkg = await prisma.package.findFirst({
      where: {
        trackingNumber: {
          equals: tracking,
          mode: 'insensitive'
        }
      }
    })

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' })
    }

    res.status(200).json(pkg)
  } catch (err) {
    console.error('Track error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
