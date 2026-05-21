import { NextRequest } from 'next/server'
import { getClientIP } from './rate-limiter'

/**
 * IP Whitelisting middleware for admin access
 * Only allows connections from whitelisted IPs
 */
export function createIPWhitelist(allowedIPs: string[]) {
  return (req: NextRequest) => {
    const clientIP = getClientIP(req)
    const isDevMode = process.env.NODE_ENV === 'development'

    // DEBUG: Log detected IP and whitelist
    console.log(`🔍 DEBUG IP Check:`)
    console.log(`   Client IP detected: ${clientIP}`)
    console.log(`   Dev Mode: ${isDevMode}`)
    console.log(`   Whitelisted IPs: ${allowedIPs.join(', ')}`)

    // In development, allow localhost
    if (isDevMode && (clientIP === '127.0.0.1' || clientIP === 'localhost')) {
      console.log(`   ✅ Local development access allowed`)
      return { success: true }
    }

    // If no IPs are whitelisted, allow all (development mode)
    if (!allowedIPs || allowedIPs.length === 0) {
      console.warn('⚠️ IP whitelist is empty - all IPs allowed (dev mode)')
      return { success: true }
    }

    // Check if client IP is in whitelist
    const isWhitelisted = allowedIPs.some((allowedIP) => {
      // Exact match
      if (clientIP === allowedIP) return true

      // CIDR range support (optional)
      if (isIPInCIDRRange(clientIP, allowedIP)) return true

      return false
    })

    if (!isWhitelisted) {
      console.warn(
        `🚨 Unauthorized access attempt from IP: ${clientIP}`
      )
      return {
        success: false,
        error: 'Access denied from your location',
        clientIP, // For logging purposes
      }
    }

    return { success: true }
  }
}

/**
 * Check if IP is within CIDR range (basic implementation)
 * Example: 192.168.1.0/24
 */
function isIPInCIDRRange(ip: string, cidr: string): boolean {
  if (!cidr.includes('/')) return false

  try {
    const [cidrIP, maskBits] = cidr.split('/')
    const mask = parseInt(maskBits, 10)

    const ipNum = ipToNumber(ip)
    const cidrNum = ipToNumber(cidrIP)

    const maskNum = (0xffffffff << (32 - mask)) >>> 0
    return (ipNum & maskNum) === (cidrNum & maskNum)
  } catch {
    return false
  }
}

/**
 * Convert IP address to number for range comparison
 */
function ipToNumber(ip: string): number {
  const parts = ip.split('.')
  if (parts.length !== 4) return 0

  return (
    (parseInt(parts[0], 10) << 24) +
    (parseInt(parts[1], 10) << 16) +
    (parseInt(parts[2], 10) << 8) +
    parseInt(parts[3], 10)
  )
}

/**
 * Get allowed IPs from environment variable
 * Format: IP1,IP2,IP3 or CIDR1/24,IP2
 */
export function getWhitelistedIPs(): string[] {
  const ips = process.env.ADMIN_ALLOWED_IPS || ''
  return ips
    .split(',')
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0)
}
