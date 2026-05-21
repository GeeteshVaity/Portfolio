import { NextResponse } from 'next/server'

/**
 * NextAuth placeholder endpoint
 * Admin features disabled for production frontend deployment
 */
export async function GET() {
  return NextResponse.json({ message: 'Not implemented' }, { status: 404 })
}

export async function POST() {
  return NextResponse.json({ message: 'Not implemented' }, { status: 404 })
}
