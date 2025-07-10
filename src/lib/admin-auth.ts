import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface AdminUser {
  userId: string
  email: string
  role: string
}

export function verifyAdminToken(request: NextRequest): AdminUser | null {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AdminUser
    
    if (decoded.role !== 'admin') {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function requireAdmin(handler: (request: NextRequest, admin: AdminUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const admin = verifyAdminToken(request)
    
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return handler(request, admin)
  }
}
