import { NextResponse } from 'next/server'

/**
 * POST /api/auth/mfa/setup
 * MFA temporarily disabled for production deployment
 */
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'MFA not available' },
    { status: 503 }
  )
}
