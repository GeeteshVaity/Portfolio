import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    attempts: number
    resetTime: number
  }
}

// In-memory store (for production, use Redis)
const rateLimitStore: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxAttempts: number // Max attempts per window
  message?: string
}

/**
 * Rate limiter middleware for protecting against brute force attacks
 * Uses IP address as the identifier
 */
export function createRateLimiter(config: RateLimitConfig) {
  return async (req: NextRequest) => {
    const clientIP = getClientIP(req)
    const key = `${clientIP}`
    const now = Date.now()

    // Initialize or reset store entry
    if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
      rateLimitStore[key] = {
        attempts: 1,
        resetTime: now + config.windowMs,
      }
      return { success: true }
    }

    // Increment attempts
    rateLimitStore[key].attempts++

    // Check if limit exceeded
    if (rateLimitStore[key].attempts > config.maxAttempts) {
      const timeRemaining = Math.ceil(
        (rateLimitStore[key].resetTime - now) / 1000
      )
      return {
        success: false,
        error: config.message || 'Too many attempts. Try again later.',
        retryAfter: timeRemaining,
      }
    }

    return { success: true }
  }
}

/**
 * Extract client IP from request
 */
export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP.trim()
  }

  // Fallback - this shouldn't happen in production
  return '127.0.0.1'
}

/**
 * Reset rate limit for a specific IP
 */
export function resetRateLimit(ip: string): void {
  delete rateLimitStore[ip]
}

/**
 * Clear all rate limits (for testing/admin purposes)
 */
export function clearAllRateLimits(): void {
  Object.keys(rateLimitStore).forEach((key) => {
    delete rateLimitStore[key]
  })
}
