import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { otpStore } from '@/lib/otp-store'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { requestId, otp } = await request.json()

    if (!requestId || !otp) {
      return NextResponse.json(
        { error: 'Request ID and OTP are required' },
        { status: 400 }
      )
    }

    // Verify OTP
    const stored = otpStore.get(requestId)
    
    if (!stored) {
      return NextResponse.json(
        { error: 'Invalid or expired request' },
        { status: 400 }
      )
    }
    
    if (Date.now() > stored.expires) {
      otpStore.delete(requestId)
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }
    
    if (stored.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP code' },
        { status: 400 }
      )
    }

    // OTP is valid, proceed with admin creation
    const { email, password, fullName } = stored.requestData

    // Check if user still doesn't exist
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      otpStore.delete(requestId)
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create admin user
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          name: fullName,
          password_hash: passwordHash,
          role: 'admin',
          provider: 'email',
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (userError) {
      console.error('Error creating admin user:', userError)
      return NextResponse.json(
        { error: 'Failed to create admin user: ' + userError.message },
        { status: 500 }
      )
    }

    // Clean up OTP
    otpStore.delete(requestId)

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: userData.id,
        email,
        name: fullName,
        role: 'admin'
      }
    })

  } catch (error) {
    console.error('Admin creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
