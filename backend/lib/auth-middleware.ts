import { NextRequest, NextResponse } from 'next/server'

/**
 * Auth middleware - temporarily disabled for production deployment
 * Authentication is handled directly in route files
 */
export async function withAuth(
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    return handler(req, null)
  }
}

export async function withAdminAuth(
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    return handler(req, null)
  }
}
