import { NextRequest, NextResponse } from 'next/server'
import { createDefaultAdmin } from '@/lib/create-admin'

export async function POST(request: NextRequest) {
  try {
    // Add a simple security check - you might want to remove this in production
    const { initKey } = await request.json()
    
    if (initKey !== 'init-tecbunny-admin-2024') {
      return NextResponse.json(
        { error: 'Invalid initialization key' },
        { status: 401 }
      )
    }

    const admin = await createDefaultAdmin()

    return NextResponse.json(
      { 
        message: 'Default admin created successfully',
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        credentials: {
          email: 'admin@tecbunny.store',
          password: 'TecBunny@Admin2024',
          warning: 'Please change the default password after first login!'
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Admin initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize admin' },
      { status: 500 }
    )
  }
}
