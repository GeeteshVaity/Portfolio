import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@geetesh.dev'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: 'project-1' },
      update: {},
      create: {
        id: 'project-1',
        title: 'Portfolio Website',
        description: 'A modern, fully-featured portfolio website built with React, TypeScript, and Tailwind CSS. Features real-time admin dashboard for managing projects and skills.',
        image: 'https://via.placeholder.com/500x300?text=Portfolio',
        link: 'https://geetesh.dev',
        githubLink: 'https://github.com/geetesh-vaity/portfolio',
        tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'MongoDB'],
        order: 1,
        published: true,
        featured: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.project.upsert({
      where: { id: 'project-2' },
      update: {},
      create: {
        id: 'project-2',
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce solution with shopping cart, payment integration, and order management. Built with Node.js backend and React frontend.',
        image: 'https://via.placeholder.com/500x300?text=E-Commerce',
        link: 'https://example-ecommerce.com',
        githubLink: 'https://github.com/geetesh-vaity/ecommerce',
        tags: ['Node.js', 'React', 'MongoDB', 'Stripe', 'Express'],
        order: 2,
        published: true,
        featured: true,
        createdBy: adminUser.id,
      },
    }),
    prisma.project.upsert({
      where: { id: 'project-3' },
      update: {},
      create: {
        id: 'project-3',
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates, team collaboration features, and deadline tracking.',
        image: 'https://via.placeholder.com/500x300?text=Task+Manager',
        link: 'https://tasks.example.com',
        githubLink: 'https://github.com/geetesh-vaity/task-manager',
        tags: ['React', 'Firebase', 'Tailwind CSS', 'Redux'],
        order: 3,
        published: true,
        featured: false,
        createdBy: adminUser.id,
      },
    }),
  ])

  console.log('✅ Sample projects created:', projects.length)

  // Create sample skills
  const skills = await Promise.all([
    // Language Skills
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
    // Framework Skills
    prisma.skill.upsert({
      where: { id: 'skill-2' },
      update: {
        name: 'React',
        category: 'Framework',
        proficiency: 'expert',
        years: 4,
        order: 1,
      },
      create: {
        id: 'skill-2',
        name: 'React',
        category: 'Framework',
        proficiency: 'expert',
        years: 4,
        order: 1,
        createdBy: adminUser.id,
      },
    }),
    prisma.skill.upsert({
      where: { id: 'skill-3' },
      update: {
        name: 'Node.js',
        category: 'Framework',
        proficiency: 'expert',
        years: 4,
        order: 2,
      },
      create: {
        id: 'skill-3',
        name: 'Node.js',
        category: 'Framework',
        proficiency: 'expert',
        years: 4,
        order: 2,
        createdBy: adminUser.id,
      },
    }),
    prisma.skill.upsert({
      where: { id: 'skill-4' },
      update: {
        name: 'Express.js',
        category: 'Framework',
        proficiency: 'advanced',
        years: 3,
        order: 3,
      },
      create: {
        id: 'skill-4',
        name: 'Express.js',
        category: 'Framework',
        proficiency: 'advanced',
        years: 3,
        order: 3,
        createdBy: adminUser.id,
      },
    }),
    // Tool Skills
    prisma.skill.upsert({
      where: { id: 'skill-5' },
      update: {
        name: 'Tailwind CSS',
        category: 'Tool',
        proficiency: 'advanced',
        years: 2,
        order: 1,
      },
      create: {
        id: 'skill-5',
        name: 'Tailwind CSS',
        category: 'Tool',
        proficiency: 'advanced',
        years: 2,
        order: 1,
        createdBy: adminUser.id,
      },
    }),
    // Database Skills
    prisma.skill.upsert({
      where: { id: 'skill-6' },
      update: {
        name: 'MongoDB',
        category: 'Database',
        proficiency: 'advanced',
        years: 3,
        order: 1,
      },
      create: {
        id: 'skill-6',
        name: 'MongoDB',
        category: 'Database',
        proficiency: 'advanced',
        years: 3,
        order: 1,
        createdBy: adminUser.id,
      },
    }),
    prisma.skill.upsert({
      where: { id: 'skill-7' },
      update: {
        name: 'PostgreSQL',
        category: 'Database',
        proficiency: 'intermediate',
        years: 2,
        order: 2,
      },
      create: {
        id: 'skill-7',
        name: 'PostgreSQL',
        category: 'Database',
        proficiency: 'intermediate',
        years: 2,
        order: 2,
        createdBy: adminUser.id,
      },
    }),
  ])

  console.log('✅ Sample skills created:', skills.length)
  console.log('🎉 Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
