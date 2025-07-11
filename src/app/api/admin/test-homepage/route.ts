import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Test endpoint to check database structure and debug homepage settings
export async function GET() {
  try {
    console.log('Testing homepage settings...');
    
    // Check if the table exists and its structure
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('homepage_settings')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Table error:', tableError);
      return NextResponse.json({ error: 'Table error', details: tableError }, { status: 500 });
    }

    console.log('Table data:', tableInfo);

    // Try to get existing settings
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('homepage_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (settingsError) {
      console.error('Settings error:', settingsError);
      return NextResponse.json({ error: 'Settings error', details: settingsError }, { status: 500 });
    }

    console.log('Settings data:', settings);

    // Check if users table exists and has admin users
    const { data: adminUsers, error: adminError } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('role', 'admin');

    if (adminError) {
      console.error('Admin users error:', adminError);
      return NextResponse.json({ error: 'Admin users error', details: adminError }, { status: 500 });
    }

    console.log('Admin users:', adminUsers);

    return NextResponse.json({
      success: true,
      tableExists: true,
      tableData: tableInfo,
      settings: settings,
      adminUsers: adminUsers
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
