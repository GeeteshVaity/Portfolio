/**
 * Create Admin User Script
 * Run this script after setting up MongoDB to create your admin account
 * 
 * Usage: node scripts/create-admin.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('🚀 Starting admin user creation...')
    
    // Get credentials from environment or use defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'geeteshvaity22@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'geesapoo215'
    const adminName = 'Admin User'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingUser) {
      console.log(`⚠️  User with email ${adminEmail} already exists!`)
      console.log(`   ID: ${existingUser.id}`)
      console.log(`   Admin: ${existingUser.isAdmin}`)
      return
    }

    // Hash password
    console.log('🔒 Hashing password...')
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Create admin user
    console.log('📝 Creating admin user...')
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        isAdmin: true,
        active: true,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Email:   ${user.email}`)
    console.log(`Name:    ${user.name}`)
    console.log(`Admin:   ${user.isAdmin}`)
    console.log(`ID:      ${user.id}`)
    console.log(`Created: ${user.createdAt}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🎉 You can now login with:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)

  } catch (error) {
    console.error('❌ Error creating admin user:')
    console.error(error.message)
    
    if (error.code === 'P2002') {
      console.error('\n⚠️  A user with this email already exists.')
      console.error('   Try deleting the existing user first or use a different email.')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the function
createAdminUser()
