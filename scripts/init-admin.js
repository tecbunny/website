/**
 * Admin Initialization Script
 * 
 * This script creates the default admin user in your TecBunny database.
 * Run this once to set up your first admin account.
 */

// Run this in your browser's console on tecbunny.store or use curl/fetch

async function initializeAdmin() {
  try {
    const response = await fetch('/api/admin/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        initKey: 'init-tecbunny-admin-2024'
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Admin initialized successfully!')
      console.log('📧 Email:', data.credentials.email)
      console.log('🔐 Password:', data.credentials.password)
      console.log('⚠️ Warning:', data.credentials.warning)
    } else {
      console.error('❌ Error:', data.error)
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

// Uncomment to run:
// initializeAdmin()

export default initializeAdmin
