import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Custom middleware for admin routes
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to admin login and registration pages
    if (pathname === '/admin/login' || pathname === '/admin/register' || pathname.startsWith('/api/admin')) {
      return NextResponse.next()
    }

    // For other admin routes, check for admin token
    const adminToken = request.cookies.get('admin-token')?.value
    
    if (!adminToken) {
      // Redirect to admin login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // You could add JWT verification here if needed
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}
