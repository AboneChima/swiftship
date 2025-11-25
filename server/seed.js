import db from './db.js'

console.log('Seeding database with sample data...')

// Sample packages
const packages = [
  {
    tracking_number: 'SSN-ONI-234567',
    sender_name: 'John Doe',
    sender_location: 'Lagos, Nigeria',
    receiver_name: 'Jane Smith',
    receiver_location: 'Abuja, Nigeria',
    weight: 2.5,
    status: 'in_transit'
  },
  {
    tracking_number: 'SSN-ABJ-789012',
    sender_name: 'Mike Johnson',
    sender_location: 'Onitsha, Anambra',
    receiver_name: 'Sarah Williams',
    receiver_location: 'Port Harcourt, Rivers',
    weight: 5.0,
    status: 'delivered'
  },
  {
    tracking_number: 'SSN-LAG-345678',
    sender_name: 'David Brown',
    sender_location: 'Enugu, Nigeria',
    receiver_name: 'Emma Davis',
    receiver_location: 'Awka, Anambra',
    weight: 1.2,
    status: 'out_for_delivery'
  },
  {
    tracking_number: 'SSN-ENS-901234',
    sender_name: 'Chris Wilson',
    sender_location: 'Kano, Nigeria',
    receiver_name: 'Lisa Anderson',
    receiver_location: 'Kaduna, Nigeria',
    weight: 3.8,
    status: 'picked_up'
  },
  {
    tracking_number: 'SSN-KAN-567890',
    sender_name: 'Robert Taylor',
    sender_location: 'Ibadan, Oyo',
    receiver_name: 'Mary Thomas',
    receiver_location: 'Lagos, Nigeria',
    weight: 4.5,
    status: 'pending'
  }
]

// Insert packages
packages.forEach(pkg => {
  try {
    const result = db.prepare(`
      INSERT INTO packages (tracking_number, sender_name, sender_location, receiver_name, receiver_location, weight, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
    `).run(
      pkg.tracking_number,
      pkg.sender_name,
      pkg.sender_location,
      pkg.receiver_name,
      pkg.receiver_location,
      pkg.weight,
      pkg.status
    )

    // Add tracking history
    const statuses = ['pending', 'picked_up']
    if (pkg.status === 'in_transit' || pkg.status === 'out_for_delivery' || pkg.status === 'delivered') {
      statuses.push('in_transit')
    }
    if (pkg.status === 'out_for_delivery' || pkg.status === 'delivered') {
      statuses.push('out_for_delivery')
    }
    if (pkg.status === 'delivered') {
      statuses.push('delivered')
    }

    statuses.forEach((status, idx) => {
      const timestamp = new Date(Date.now() - (statuses.length - idx) * 24 * 60 * 60 * 1000).toISOString()
      db.prepare('INSERT INTO tracking_history (package_id, status, timestamp) VALUES (?, ?, ?)').run(
        result.lastInsertRowid,
        status,
        timestamp
      )
    })

    console.log(`✅ Added package: ${pkg.tracking_number}`)
  } catch (err) {
    console.log(`⚠️  Package ${pkg.tracking_number} already exists`)
  }
})

console.log('\n✅ Database seeding complete!')
console.log('\nSample tracking numbers to test:')
packages.forEach(pkg => {
  console.log(`  - ${pkg.tracking_number} (${pkg.status})`)
})
