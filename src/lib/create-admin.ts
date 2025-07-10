import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

const DEFAULT_ADMIN = {
  email: 'admin@tecbunny.store',
  password: 'TecBunny@Admin2024',
  name: 'TecBunny Administrator'
}

export async function createDefaultAdmin() {
  try {
    // Check if default admin already exists
    const { data: existingAdmin } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', DEFAULT_ADMIN.email)
      .single()

    if (existingAdmin) {
      console.log('Default admin already exists')
      return existingAdmin
    }

    // Hash password
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 12)

    // Create admin user
    const { data: adminUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: DEFAULT_ADMIN.email,
          name: DEFAULT_ADMIN.name,
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

    if (error) {
      console.error('Error creating default admin:', error)
      throw error
    }

    console.log('Default admin created successfully')
    console.log('Email:', DEFAULT_ADMIN.email)
    console.log('Password:', DEFAULT_ADMIN.password)
    console.log('⚠️  Please change the default password after first login!')

    return adminUser
  } catch (error) {
    console.error('Failed to create default admin:', error)
    throw error
  }
}
