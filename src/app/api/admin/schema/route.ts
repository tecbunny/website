import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('Applying database schema to Supabase...')

    // Check if users table exists and has required columns
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1)

    if (usersError) {
      // If users table doesn't exist, we need to create it
      console.log('Users table not found or missing columns')
      
      return NextResponse.json({
        success: false,
        error: 'Database schema not applied',
        instructions: [
          '1. Go to your Supabase dashboard',
          '2. Navigate to SQL Editor',
          '3. Execute the SQL from /lib/database-schema.sql',
          '4. Make sure to add the following columns to users table:',
          '   - password_hash VARCHAR(255)',
          '   - role VARCHAR(50) DEFAULT \'user\'',
          '   - provider VARCHAR(50) DEFAULT \'email\'',
          '5. Run this API again after applying the schema'
        ],
        schema_location: '/lib/database-schema.sql'
      }, { status: 400 })
    }

    // Check if password_hash column exists
    const testUser = users?.[0]
    if (!testUser || !('password_hash' in testUser)) {
      return NextResponse.json({
        success: false,
        error: 'Missing password_hash column',
        instructions: [
          'Add password_hash column to users table:',
          'ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);',
          'ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT \'user\';',
          'ALTER TABLE users ADD COLUMN provider VARCHAR(50) DEFAULT \'email\';'
        ]
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema is properly configured',
      tables: {
        users: 'Available with required columns'
      }
    })

  } catch (error) {
    console.error('Database schema check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check database schema',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
