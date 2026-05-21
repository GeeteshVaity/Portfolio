import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import {
  generateMFASecret,
  verifyTOTP,
  hashBackupCodes,
} from '@/lib/mfa-service'

/**
 * POST /api/auth/mfa/setup
 * Generate MFA secret and QR code for user
 * Requires authentication
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Generate new MFA secret
    const { secret, qrCode, backupCodes } = generateMFASecret(user.email)

    return NextResponse.json(
      {
        success: true,
        message: 'MFA setup initiated',
        data: {
          secret,
          qrCode, // URL to QR code
          backupCodes, // Plain text backup codes (show only once!)
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('MFA setup error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/auth/mfa/setup
 * Confirm MFA setup with verification token
 * This stores the MFA secret and backup codes in the database
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { secret, token } = body

    if (!secret || !token) {
      return NextResponse.json(
        { success: false, message: 'Secret and token are required' },
        { status: 400 }
      )
    }

    // Verify the token against the secret
    const isValidToken = verifyTOTP(secret, token)

    if (!isValidToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification token' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Generate new backup codes
    const { backupCodes } = generateMFASecret(user.email)
    const hashedBackupCodes = hashBackupCodes(backupCodes)

    // Update user with MFA enabled
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: true,
        mfaSecret: secret,
        mfaBackupCodes: hashedBackupCodes,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'MFA enabled successfully',
        data: {
          backupCodes, // Return plain codes one more time for user to save
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('MFA setup confirmation error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/auth/mfa/setup
 * Disable MFA for user (requires password verification)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required to disable MFA' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify password
    const bcrypt = require('bcryptjs')
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      )
    }

    // Disable MFA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
      },
    })

    return NextResponse.json(
      { success: true, message: 'MFA disabled successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('MFA disable error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
