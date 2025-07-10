import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .limit(1)

    if (error) {
      console.error('Database connection test failed:', error)
      return { 
        success: false, 
        error: error.message,
        details: 'Could not connect to users table. Please ensure the table exists.'
      }
    }

    console.log('Database connection test passed')
    return { 
      success: true, 
      data: data,
      message: 'Database connection successful'
    }

  } catch (error) {
    console.error('Database connection error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to connect to database'
    }
  }
}

export async function initializeDatabase() {
  try {
    console.log('Initializing database...')

    // First test the connection
    const connectionTest = await testDatabaseConnection()
    if (!connectionTest.success) {
      return connectionTest
    }

    // Check if admin user already exists
    const { data: existingAdmin } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', 'admin@tecbunny.com')
      .eq('role', 'admin')
      .single()

    if (!existingAdmin) {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 12)
      
      const { error: adminError } = await supabaseAdmin
        .from('users')
        .insert({
          email: 'admin@tecbunny.com',
          password_hash: adminPassword,
          name: 'Admin User',
          role: 'admin',
          email_verified: true,
          provider: 'email'
        })

      if (adminError) {
        console.error('Error creating admin user:', adminError)
        return { 
          success: false, 
          error: adminError.message,
          details: 'Failed to create admin user'
        }
      } else {
        console.log('Admin user created successfully')
      }
    } else {
      console.log('Admin user already exists')
    }

    console.log('Database initialization complete!')
    return { success: true }

  } catch (error) {
    console.error('Database initialization error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Database initialization failed'
    }
  }
}
