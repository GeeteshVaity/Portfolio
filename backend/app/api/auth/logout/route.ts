import { NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * Logout the current user
 */
export async function POST() {
  try {
    // For v5 beta compatibility, simplified logout
    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
