import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'

/**
 * GET /api/projects
 * Fetch all published projects
 */
export async function GET(req: NextRequest) {
  try {
    console.log('Fetching projects...')
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })

    console.log('Found projects:', projects.length)
    
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

    const response = NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    )
    
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  } catch (error) {
    console.error('Get projects error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch projects',
        error: errorMessage,
      },
      { status: 500 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
}

/**
 * Helper function to check if user is admin
 */
function isAuthorized(req: NextRequest): boolean {
  // Check for bearer token or admin email header
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return true
  }
  
  // Allow requests from same origin (frontend)
  const origin = req.headers.get('origin') || req.headers.get('referer')
  if (origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
    return true
  }
  
  return false
}

/**
 * POST /api/projects
 * Create new project (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = projectSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.error.flatten(),
        },
        { status: 400 }
      )
    }

    // Get or create admin user for createdBy field
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.local'
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })
    
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          password: 'system-generated',
          isAdmin: true,
        },
      })
    }

    const newProject = await prisma.project.create({
      data: {
        ...validation.data,
        createdBy: adminUser.id,
      },
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'Project created successfully',
        data: newProject,
      },
      { status: 201 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Create project error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to create project',
        error: errorMessage,
      },
      { status: 500 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}
