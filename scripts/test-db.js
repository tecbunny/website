import { supabaseAdmin } from '@/lib/supabase'

async function testDatabase() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .limit(1)

    if (error) {
      console.error('❌ Database connection failed:', error.message)
      console.log('\n🔧 To fix this, run the SQL from src/lib/database-schema.sql in your Supabase dashboard')
      return
    }

    console.log('✅ Database connection successful!')
    console.log('📊 Sample data:', data)
    
    // Test if we can create a user
    const testEmail = 'test@example.com'
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', testEmail)
      .single()

    if (!existingUser) {
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email: testEmail,
          name: 'Test User',
          role: 'user'
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Failed to create test user:', createError.message)
      } else {
        console.log('✅ Test user created successfully')
        
        // Clean up - delete test user
        await supabaseAdmin
          .from('users')
          .delete()
          .eq('id', newUser.id)
        
        console.log('🧹 Test user cleaned up')
      }
    } else {
      console.log('👤 Test user already exists')
    }

  } catch (error) {
    console.error('❌ Database test failed:', error)
  }
}

testDatabase()
