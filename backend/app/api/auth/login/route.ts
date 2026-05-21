import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'
import { createRateLimiter, getClientIP } from '@/lib/rate-limiter'
import { createIPWhitelist, getWhitelistedIPs } from '@/lib/ip-whitelist'

// Rate limiter: 5 attempts per 15 minutes per IP
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  message: 'Too many login attempts. Please try again after 15 minutes.',
})

// IP whitelist middleware
const ipWhitelist = createIPWhitelist(getWhitelistedIPs())

/**
 * POST /api/auth/login
 * Login with email and password
 * Implements: Rate limiting, IP whitelisting, account lockout, audit logging
 */
export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req)
  const userAgent = req.headers.get('user-agent') || 'Unknown'

  try {
    // Step 1: Check IP whitelist
    const ipCheckResult = ipWhitelist(req)
    if (!ipCheckResult.success) {
      await logAuditEvent(
        null,
        'login_attempt_blocked_ip',
        clientIP,
        userAgent,
        'failure',
        `IP not whitelisted: ${clientIP}`
      )
      return NextResponse.json(
        { success: false, message: ipCheckResult.error },
        { status: 403 }
      )
    }

    // Step 2: Check rate limit
    const rateLimitResult = await loginLimiter(req)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitResult.error,
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      )
    }

    // Step 3: Validate input
    const body = await req.json()
    const validation = loginSchema.safeParse(body)
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

    const { email, password } = validation.data

    // Step 4: Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      await logAuditEvent(
        null,
        'login_attempt_invalid_email',
        clientIP,
        userAgent,
        'failure',
        `Email not found: ${email}`
      )
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Step 5: Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const timeRemaining = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000
      )
      await logAuditEvent(
        user.id,
        'login_attempt_account_locked',
        clientIP,
        userAgent,
        'failure',
        `Account locked for ${timeRemaining} more minutes`
      )
      return NextResponse.json(
        {
          success: false,
          message: `Account is locked. Try again in ${timeRemaining} minutes.`,
        },
        { status: 423 }
      )
    }

    // Step 6: Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      // Increment failed attempts
      const failedAttempts = user.failedLoginAttempts + 1
      const isNowLocked = failedAttempts >= 5

      let lockedUntil = null
      if (isNowLocked) {
        // Lock account for 30 minutes
        lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: isNowLocked ? 0 : failedAttempts,
          lockedUntil,
        },
      })

      await logAuditEvent(
        user.id,
        'login_attempt_invalid_password',
        clientIP,
        userAgent,
        'failure',
        `Failed attempt ${failedAttempts}${isNowLocked ? ' - Account locked' : ''}`
      )

      return NextResponse.json(
        {
          success: false,
          message: isNowLocked
            ? 'Too many failed attempts. Account locked for 30 minutes.'
            : 'Invalid credentials',
        },
        { status: 401 }
      )
    }

    // Step 7: Reset failed attempts on successful password verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginIP: clientIP,
        lastLoginTime: new Date(),
      },
    })

    // Step 8: Check if MFA is enabled
    if (user.mfaEnabled) {
      // Return response indicating MFA is required
      await logAuditEvent(
        user.id,
        'login_mfa_required',
        clientIP,
        userAgent,
        'success',
        'Password verified, awaiting MFA'
      )

      return NextResponse.json(
        {
          success: true,
          message: 'MFA required',
          mfaRequired: true,
          userId: user.id,
          // Don't return full user data yet
        },
        { status: 200 }
      )
    }

    // Step 9: Login successful (no MFA)
    await logAuditEvent(
      user.id,
      'login_success',
      clientIP,
      userAgent,
      'success',
      'Password verified, no MFA'
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
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
    console.error('Login error:', error)
    await logAuditEvent(
      null,
      'login_error',
      clientIP,
      userAgent,
      'failure',
      `Server error: ${error instanceof Error ? error.message : 'Unknown'}`
    )
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * Log audit event
 */
async function logAuditEvent(
  userId: string | null,
  action: string,
  ipAddress: string,
  userAgent: string,
  status: 'success' | 'failure',
  details?: string
) {
  try {
    // Only log for admin users
    if (userId) {
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
    }
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
