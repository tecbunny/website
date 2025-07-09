import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateEmail, validatePhone } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone, role = 'customer' } = await request.json()

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (phone && !validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role
        }
      }
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Create user profile in database
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            full_name: fullName,
            phone,
            role,
            is_verified: false
          }
        ])

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        )
      }

      // If vendor, create vendor profile
      if (role === 'vendor') {
        const { error: vendorError } = await supabase
          .from('vendors')
          .insert([
            {
              user_id: authData.user.id,
              business_name: fullName,
              is_approved: false,
              commission_rate: 5.0 // Default 5%
            }
          ])

        if (vendorError) {
          console.error('Error creating vendor profile:', vendorError)
        }
      }
    }

    return NextResponse.json(
      { 
        message: 'User registered successfully. Please check your email to verify your account.',
        user: {
          id: authData.user?.id,
          email,
          full_name: fullName,
          role
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
