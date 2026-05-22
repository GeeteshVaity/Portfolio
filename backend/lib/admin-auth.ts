import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'

type AdminTokenPayload = {
  sub: string
  email: string
  isAdmin: true
  exp: number
}

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(value: string): string {
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4)
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
}

function getAdminSecret(): string {
  return process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || ''
}

function getStaticAdminToken(): string {
  return process.env.ADMIN_API_TOKEN || ''
}

function safeEquals(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) {
    return false
  }

  return timingSafeEqual(aBuffer, bBuffer)
}

export function createAdminToken(payload: Omit<AdminTokenPayload, 'exp' | 'isAdmin'>): string {
  const secret = getAdminSecret()

  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is required to issue admin tokens')
  }

  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      isAdmin: true,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    })
  )
  const signature = base64UrlEncode(createHmac('sha256', secret).update(`${header}.${body}`).digest())

  return `${header}.${body}.${signature}`
}

function verifyAdminToken(token: string): AdminTokenPayload | null {
  const staticToken = getStaticAdminToken()

  if (staticToken && safeEquals(token, staticToken)) {
    return {
      sub: 'static-admin-token',
      email: process.env.ADMIN_EMAIL || 'admin',
      isAdmin: true,
      exp: Math.floor(Date.now() / 1000) + 60,
    }
  }

  const secret = getAdminSecret()

  if (!secret) {
    return null
  }

  const [header, body, signature] = token.split('.')

  if (!header || !body || !signature) {
    return null
  }

  const expectedSignature = base64UrlEncode(
    createHmac('sha256', secret).update(`${header}.${body}`).digest()
  )

  if (!safeEquals(signature, expectedSignature)) {
    return null
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as AdminTokenPayload

    if (!payload.isAdmin || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''

  if (!token) {
    return false
  }

  const payload = verifyAdminToken(token)

  if (!payload) {
    return false
  }

  if (payload.sub === 'static-admin-token') {
    return true
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { isAdmin: true, active: true },
  })

  return Boolean(user?.isAdmin && user.active)
}
