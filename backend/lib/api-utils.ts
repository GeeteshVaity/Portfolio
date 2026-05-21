import { NextRequest, NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Serialize data: convert Date objects to ISO strings for proper JSON serialization
 */
export function serializeData<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString()
      }
      return value
    })
  )
}

export function successResponse<T>(
  data: T,
  statusCode: number = 200,
  message: string = 'Success'
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data: serializeData(data),
    },
    { status: statusCode }
  )
}

export function errorResponse(
  error: unknown,
  defaultStatusCode: number = 500
) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: defaultStatusCode }
    )
  }

  return NextResponse.json(
    {
      success: false,
      message: 'An unexpected error occurred',
    },
    { status: defaultStatusCode }
  )
}

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    throw new ApiError(401, 'Unauthorized', 'AUTH_REQUIRED')
  }

  return session
}

export async function requireAdmin(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user) {
    throw new ApiError(401, 'Unauthorized', 'AUTH_REQUIRED')
  }

  // In a real app, check if user is admin in database
  // For now, we'll check if email matches admin email
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    throw new ApiError(403, 'Forbidden: Admin access required', 'ADMIN_REQUIRED')
  }

  return session
}
