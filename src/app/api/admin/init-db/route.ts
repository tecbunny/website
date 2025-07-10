import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('Initializing database...')
    
    // Check if users table exists and has required columns
    const { error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, email, password_hash, role, name')
      .limit(1)

    if (usersError) {
      console.error('Users table error:', usersError)
      return NextResponse.json({
        success: false,
        error: 'Database schema not properly set up',
        details: usersError.message,
        instructions: [
          '1. Go to your Supabase dashboard',
          '2. Navigate to SQL Editor',
          '3. Copy and run the SQL from /lib/database-schema.sql',
          '4. Make sure all tables are created successfully',
          '5. Run this API again'
        ],
        sql_file: '/lib/database-schema.sql'
      }, { status: 400 })
    }

    // Check database schema is ready
    return NextResponse.json({
      success: true,
      message: 'Database schema is ready',
      note: 'Database tables are properly configured. Admin users can be created through the registration system.'
    })

  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Test database connection
    const { error } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection is working',
      schema_status: 'OK'
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
