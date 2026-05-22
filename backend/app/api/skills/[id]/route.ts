import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { skillUpdateSchema } from '@/lib/validations'
import { verifyAdminRequest } from '@/lib/admin-auth'
import { corsPreflight, withCors } from '@/lib/cors'

/**
 * PUT /api/skills/[id]
 * Update skill (admin only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    const validation = skillUpdateSchema.safeParse(body)
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

    const skill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!skill) {
      return withCors(
        req,
        NextResponse.json(
          {
            success: false,
            message: 'Skill not found',
          },
          { status: 404 }
        )
      )
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: validation.data,
    })

    return withCors(
      req,
      NextResponse.json(
        {
          success: true,
          message: 'Skill updated successfully',
          data: updatedSkill,
        },
        { status: 200 }
      )
    )
  } catch (error) {
    console.error('Update skill error:', error)
    return withCors(
      req,
      NextResponse.json(
        {
          success: false,
          message: 'Failed to update skill',
        },
        { status: 500 }
      )
    )
  }
}

/**
 * DELETE /api/skills/[id]
 * Delete skill (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    const skill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!skill) {
      return withCors(
        req,
        NextResponse.json(
          {
            success: false,
            message: 'Skill not found',
          },
          { status: 404 }
        )
      )
    }

    await prisma.skill.delete({
      where: { id },
    })

    return withCors(
      req,
      NextResponse.json(
        {
          success: true,
          message: 'Skill deleted successfully',
        },
        { status: 200 }
      )
    )
  } catch (error) {
    console.error('Delete skill error:', error)
    return withCors(
      req,
      NextResponse.json(
        {
          success: false,
          message: 'Failed to delete skill',
        },
        { status: 500 }
      )
    )
  }
}

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req)
}
