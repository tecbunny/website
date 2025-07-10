import { NextResponse } from 'next/server'
import { initializeDatabase, testDatabaseConnection } from '@/lib/database-init'

export async function POST() {
  try {
    // Test database connection first
    const connectionTest = await testDatabaseConnection()
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionTest.error
      }, { status: 500 })
    }

    // Initialize database
    const result = await initializeDatabase()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        connection: 'OK'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Database initialization failed',
        details: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Database init API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await testDatabaseConnection()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Database connection is working',
        data: result.data
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Database test API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}
