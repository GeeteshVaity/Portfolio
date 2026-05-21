import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { skillUpdateSchema } from '@/lib/validations'

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
 * PUT /api/skills/[id]
 * Update skill (admin only)
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
          message: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = skillUpdateSchema.safeParse(body)
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

    // Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: params.id },
    })

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          message: 'Skill not found',
        },
        { status: 404 }
      )
    }

    const updatedSkill = await prisma.skill.update({
      where: { id: params.id },
      data: validation.data,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Skill updated successfully',
        data: updatedSkill,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update skill error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update skill',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/skills/[id]
 * Delete skill (admin only)
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
          message: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    // Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: params.id },
    })

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          message: 'Skill not found',
        },
        { status: 404 }
      )
    }

    await prisma.skill.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Skill deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete skill error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete skill',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
