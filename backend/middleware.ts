import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { corsPreflight, withCors } from '@/lib/cors'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (request.method === 'OPTIONS') {
    return corsPreflight(request)
  }

  return withCors(request, response)
}

export const config = {
  matcher: ['/api/:path*'],
}
