import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export async function initializeDatabase() {
  try {
    console.log('Initializing database...')

    // Create some sample users if they don't exist
    const adminPassword = await bcrypt.hash('password123', 12)
    const userPassword = await bcrypt.hash('password123', 12)

    // Insert admin user
    const { error: adminError } = await supabase
      .from('users')
      .upsert({
        email: 'admin@tecbunny.com',
        password_hash: adminPassword,
        name: 'Admin User',
        role: 'admin'
      }, {
        onConflict: 'email'
      })

    if (adminError) {
      console.error('Error creating admin user:', adminError)
    } else {
      console.log('Admin user created/updated successfully')
    }

    // Insert regular user
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        email: 'user@example.com',
        password_hash: userPassword,
        name: 'John Doe',
        role: 'user'
      }, {
        onConflict: 'email'
      })

    if (userError) {
      console.error('Error creating regular user:', userError)
    } else {
      console.log('Regular user created/updated successfully')
    }

    console.log('Database initialization complete!')
    return { success: true }

  } catch (error) {
    console.error('Database initialization failed:', error)
    return { success: false, error }
  }
}

export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Database connection test failed:', error)
      return { success: false, error }
    }

    console.log('Database connection successful!')
    return { success: true, data }
  } catch (error) {
    console.error('Database connection test error:', error)
    return { success: false, error }
  }
}
