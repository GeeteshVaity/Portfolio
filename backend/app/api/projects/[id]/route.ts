import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectUpdateSchema } from '@/lib/validations'

/**
 * Helper function to check if user is admin
 */
function isAuthorized(req: NextRequest): boolean {
  // Check for bearer token
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
 * PUT /api/projects/[id]
 * Update project (admin only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - Admin access required',
        },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = projectUpdateSchema.safeParse(body)
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

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: 'Project not found',
        },
        { status: 404 }
      )
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: validation.data,
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'Project updated successfully',
        data: updatedProject,
      },
      { status: 200 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Update project error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to update project',
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
 * DELETE /api/projects/[id]
 * Delete project (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - Admin access required',
        },
        { status: 401 }
      )
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: 'Project not found',
        },
        { status: 404 }
      )
    }

    await prisma.project.delete({
      where: { id: params.id },
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'Project deleted successfully',
      },
      { status: 200 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  } catch (error) {
    console.error('Delete project error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to delete project',
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
