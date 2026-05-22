import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectUpdateSchema } from '@/lib/validations'
import { verifyAdminRequest } from '@/lib/admin-auth'
import { corsPreflight, withCors } from '@/lib/cors'

/**
 * PUT /api/projects/[id]
 * Update project (admin only)
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
            message: 'Unauthorized - Admin access required',
          },
          { status: 401 }
        )
      )
    }

    const body = await req.json()

    const validation = projectUpdateSchema.safeParse(body)
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

    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return withCors(
        req,
        NextResponse.json(
          {
            success: false,
            message: 'Project not found',
          },
          { status: 404 }
        )
      )
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: validation.data,
    })

    return withCors(
      req,
      NextResponse.json(
        {
          success: true,
          message: 'Project updated successfully',
          data: updatedProject,
        },
        { status: 200 }
      )
    )
  } catch (error) {
    console.error('Update project error:', error)
    return withCors(
      req,
      NextResponse.json(
        {
          success: false,
          message: 'Failed to update project',
        },
        { status: 500 }
      )
    )
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete project (admin only)
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
            message: 'Unauthorized - Admin access required',
          },
          { status: 401 }
        )
      )
    }

    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return withCors(
        req,
        NextResponse.json(
          {
            success: false,
            message: 'Project not found',
          },
          { status: 404 }
        )
      )
    }

    await prisma.project.delete({
      where: { id },
    })

    return withCors(
      req,
      NextResponse.json(
        {
          success: true,
          message: 'Project deleted successfully',
        },
        { status: 200 }
      )
    )
  } catch (error) {
    console.error('Delete project error:', error)
    return withCors(
      req,
      NextResponse.json(
        {
          success: false,
          message: 'Failed to delete project',
        },
        { status: 500 }
      )
    )
  }
}

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req)
}
