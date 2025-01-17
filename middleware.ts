import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import type { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')

  // Check if this is an API route that needs protection
  if (request.nextUrl.pathname.startsWith('/api/members')) {
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      verify(token.value, JWT_SECRET)
      return NextResponse.next()
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/members/:path*'
}

