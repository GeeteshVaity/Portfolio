import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'
import { verifyAdminRequest } from '@/lib/admin-auth'
import { corsPreflight, withCors } from '@/lib/cors'

/**
 * GET /api/projects
 * Fetch all published projects
 */
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })
    
    // Simple serialization with all required fields
    const data = projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      link: p.link,
      githubLink: p.githubLink,
      tags: p.tags,
      order: p.order,
      published: p.published,
      featured: p.featured,
      createdBy: p.createdBy,
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }))

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/projects
 * Create new project (admin only)
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

    const validation = projectSchema.safeParse(body)
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

    const newProject = await prisma.project.create({
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
          message: 'Project created successfully',
          data: newProject,
        },
        { status: 201 }
      )
    )
  } catch (error) {
    console.error('Create project error:', error)
    return withCors(
      req,
      NextResponse.json(
        {
          success: false,
          message: 'Failed to create project',
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
