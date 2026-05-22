import { NextRequest } from 'next/server'
import { getClientIP } from './rate-limiter'

export function createIPWhitelist(allowedIPs: string[]) {
  return (req: NextRequest) => {
    const clientIP = getClientIP(req)
    const isDevMode = process.env.NODE_ENV === 'development'

    if (isDevMode && (clientIP === '127.0.0.1' || clientIP === 'localhost')) {
      return { success: true }
    }

    if (!allowedIPs || allowedIPs.length === 0) {
      return { success: true }
    }

    const isWhitelisted = allowedIPs.some((allowedIP) => {
      if (clientIP === allowedIP) return true
      if (isIPInCIDRRange(clientIP, allowedIP)) return true
      return false
    })

    if (!isWhitelisted) {
      return {
        success: false,
        error: 'Access denied from your location',
        clientIP,
      }
    }

    return { success: true }
  }
}

function isIPInCIDRRange(ip: string, cidr: string): boolean {
  if (!cidr.includes('/')) return false

  try {
    const [cidrIP, maskBits] = cidr.split('/')
    const mask = parseInt(maskBits, 10)

    if (!Number.isInteger(mask) || mask < 0 || mask > 32) {
      return false
    }

    const ipNum = ipToNumber(ip)
    const cidrNum = ipToNumber(cidrIP)

    if (ipNum === null || cidrNum === null) {
      return false
    }

    const maskNum = mask === 0 ? 0 : (0xffffffff << (32 - mask)) >>> 0
    return (ipNum & maskNum) === (cidrNum & maskNum)
  } catch {
    return false
  }
}

function ipToNumber(ip: string): number | null {
  const parts = ip.split('.')
  if (parts.length !== 4) return null

  const nums = parts.map((part) => Number(part))

  if (nums.some((num) => !Number.isInteger(num) || num < 0 || num > 255)) {
    return null
  }

  return (((nums[0] << 24) >>> 0) + (nums[1] << 16) + (nums[2] << 8) + nums[3]) >>> 0
}

export function getWhitelistedIPs(): string[] {
  return (process.env.ADMIN_ALLOWED_IPS || '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean)
}
