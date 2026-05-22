import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required for seeding')
  }

  if (adminPassword.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters long')
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      isAdmin: true,
      active: true,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: process.env.ADMIN_NAME || 'Admin User',
      isAdmin: true,
      active: true,
    },
  })

  await Promise.all([
    prisma.project.upsert({
      where: { id: 'project-1' },
      update: {},
      create: {
        id: 'project-1',
        title: 'Portfolio Website',
        description:
          'A modern portfolio website with an admin dashboard for managing projects and skills.',
        image: 'https://via.placeholder.com/500x300?text=Portfolio',
        link: 'https://geetesh.dev',
        githubLink: 'https://github.com/geetesh-vaity/portfolio',
        tags: ['React', 'TypeScript', 'Next.js', 'MongoDB'],
        order: 1,
        published: true,
        featured: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.skill.upsert({
      where: { id: 'skill-1' },
      update: {
        name: 'TypeScript',
        category: 'Language',
        proficiency: 'advanced',
        years: 3,
        order: 1,
      },
      create: {
        id: 'skill-1',
        name: 'TypeScript',
        category: 'Language',
        proficiency: 'advanced',
        years: 3,
        order: 1,
        createdBy: adminUser.id,
      },
    }),
  ])

  console.log(`Seed completed for admin: ${adminUser.email}`)
}

main()
  .catch(async (error) => {
    console.error('Seeding failed:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  })
  .then(async () => {
    await prisma.$disconnect()
  })
