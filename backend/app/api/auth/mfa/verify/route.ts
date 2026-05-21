import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTOTP, verifyHashedBackupCode } from '@/lib/mfa-service'
import { getClientIP } from '@/lib/rate-limiter'

/**
 * POST /api/auth/mfa/verify
 * Verify MFA token (TOTP or backup code)
 */
export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req)
  const userAgent = req.headers.get('user-agent') || 'Unknown'

  try {
    const body = await req.json()
    const { userId, token } = body

    // Validate input
    if (!userId || !token) {
      return NextResponse.json(
        { success: false, message: 'userId and token are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.mfaEnabled || !user.mfaSecret) {
      return NextResponse.json(
        { success: false, message: 'MFA not enabled for this account' },
        { status: 400 }
      )
    }

    // Normalize token (remove spaces)
    const normalizedToken = token.toUpperCase().replace(/\s/g, '')

    let isValid = false
    let isBackupCode = false

    // Try TOTP first
    if (normalizedToken.length === 6 && /^\d+$/.test(normalizedToken)) {
      isValid = verifyTOTP(user.mfaSecret, normalizedToken)
    }

    // Try backup code if TOTP failed
    if (!isValid && user.mfaBackupCodes.length > 0) {
      const backupCodeResult = verifyHashedBackupCode(
        normalizedToken,
        user.mfaBackupCodes
      )
      isValid = backupCodeResult.valid
      isBackupCode = backupCodeResult.valid

      // Update backup codes if valid
      if (isValid) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            mfaBackupCodes: backupCodeResult.remainingCodes,
          },
        })
      }
    }

    // Log audit event
    await logAuditEvent(
      userId,
      isBackupCode ? 'mfa_backup_code_used' : 'mfa_totp_verified',
      clientIP,
      userAgent,
      isValid ? 'success' : 'failure',
      isValid
        ? `MFA verified via ${isBackupCode ? 'backup code' : 'TOTP'}`
        : 'Invalid MFA token'
    )

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid MFA token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'MFA verified successfully',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('MFA verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Log audit event
 */
async function logAuditEvent(
  userId: string,
  action: string,
  ipAddress: string,
  userAgent: string,
  status: 'success' | 'failure',
  details?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        ipAddress,
        userAgent: userAgent.slice(0, 255),
        status,
        details,
      },
    })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
