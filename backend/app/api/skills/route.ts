import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { skillSchema } from '@/lib/validations'
import { verifyAdminRequest } from '@/lib/admin-auth'
import { corsPreflight, withCors } from '@/lib/cors'

/**
 * GET /api/skills
 * Fetch all skills
 */
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    })
    
    // Simple serialization
    const data = skills.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      years: s.years,
      order: s.order,
      createdAt: s.createdAt?.toISOString(),
      updatedAt: s.updatedAt?.toISOString(),
    }))

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get skills error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch skills',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/skills
 * Create new skill (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return withCors(
        req,
        NextResponse.json(
          {
            success: false,
            message: 'Unauthorized',
          },
          { status: 401 }
        )
      )
    }

    const body = await req.json()

    const validation = skillSchema.safeParse(body)
    if (!validation.success) {
      return withCors(
        req,
        NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            errors: validation.error.flatten(),
          },
          { status: 400 }
        )
      )
    }

    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      return withCors(
        req,
        NextResponse.json(
          {
            success: false,
            message: 'ADMIN_EMAIL is not configured',
          },
          { status: 500 }
        )
      )
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!adminUser) {
      return withCors(
        req,
        NextResponse.json(
          {
            success: false,
            message: 'Admin user not found',
          },
          { status: 500 }
        )
      )
    }

    const newSkill = await prisma.skill.create({
      data: {
        ...validation.data,
        createdBy: adminUser.id,
      },
    })

    return withCors(
      req,
      NextResponse.json(
        {
          success: true,
          message: 'Skill created successfully',
          data: newSkill,
        },
        { status: 201 }
      )
    )
  } catch (error) {
    console.error('Create skill error:', error)
    return withCors(
      req,
      NextResponse.json(
        {
          success: false,
          message: 'Failed to create skill',
        },
        { status: 500 }
      )
    )
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req)
}
