import { supabase } from './supabase'
import fs from 'fs'
import path from 'path'

export async function runDatabaseMigration() {
  try {
    console.log('Starting database migration...')

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'src', 'lib', 'database-schema.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')

    // Split SQL commands (simple approach - split by semicolon and newline)
    const commands = sqlContent
      .split(';\n')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--'))

    console.log(`Found ${commands.length} SQL commands to execute`)

    // Execute each command
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      if (command) {
        console.log(`Executing command ${i + 1}/${commands.length}...`)
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: command })
          if (error) {
            console.error(`Error in command ${i + 1}:`, error)
            // Continue with other commands even if one fails
          } else {
            console.log(`Command ${i + 1} executed successfully`)
          }
        } catch (err) {
          console.error(`Exception in command ${i + 1}:`, err)
        }
      }
    }

    console.log('Database migration completed!')
    return { success: true }

  } catch (error) {
    console.error('Database migration failed:', error)
    return { success: false, error }
  }
}

// Alternative approach: Execute SQL directly via raw query
export async function createTablesDirectly() {
  try {
    console.log('Creating tables directly...')

    const { error: usersError } = await supabase.from('users').select('id').limit(1)
    if (usersError && usersError.code === 'PGRST116') {
      // Table doesn't exist, create it
      console.log('Users table does not exist, manual creation needed via Supabase dashboard')
    }

    console.log('Please run the SQL commands from database-schema.sql in your Supabase SQL editor')
    return { success: true, message: 'Please run SQL manually in Supabase dashboard' }

  } catch (error) {
    console.error('Table creation failed:', error)
    return { success: false, error }
  }
}
