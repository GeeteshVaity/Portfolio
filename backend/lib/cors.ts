import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_ALLOWED_METHODS = 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
const DEFAULT_ALLOWED_HEADERS =
  'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version'

function getAllowedOrigins(): string[] {
  return (process.env.CORS_ALLOWED_ORIGINS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export function getCorsOrigin(req: NextRequest): string {
  const requestOrigin = req.headers.get('origin')
  const allowedOrigins = getAllowedOrigins()

  if (!requestOrigin) {
    return allowedOrigins[0] || '*'
  }

  if (allowedOrigins.length === 0) {
    return process.env.NODE_ENV === 'production' ? requestOrigin : '*'
  }

  return allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0]
}

export function withCors(
  req: NextRequest,
  response: NextResponse,
  methods = DEFAULT_ALLOWED_METHODS
): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', getCorsOrigin(req))
  response.headers.set('Access-Control-Allow-Methods', methods)
  response.headers.set('Access-Control-Allow-Headers', DEFAULT_ALLOWED_HEADERS)
  response.headers.set('Vary', 'Origin')
  return response
}

export function corsPreflight(req: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 204 })
  response.headers.set('Access-Control-Max-Age', '86400')
  return withCors(req, response)
}
