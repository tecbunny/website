import { NextResponse } from 'next/server'

export async function POST() {
  try {
    return NextResponse.json(
      { 
        message: 'Admin initialization is no longer needed. Please use the OTP-based registration at /admin/register',
        redirect: '/admin/register'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
