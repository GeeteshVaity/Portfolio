import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { skillSchema } from '@/lib/validations'

/**
 * GET /api/skills
 * Fetch all skills
 */
export async function GET() {
  try {
    console.log('Fetching skills...')
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    })

    console.log('Found skills:', skills.length)
    
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
    console.error('Get skills error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch skills',
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
 * POST /api/skills
 * Create new skill (admin only)
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
    const validation = skillSchema.safeParse(body)
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

    const newSkill = await prisma.skill.create({
      data: {
        ...validation.data,
        createdBy: adminUser.id,
      },
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'Skill created successfully',
        data: newSkill,
      },
      { status: 201 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Create skill error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to create skill',
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
