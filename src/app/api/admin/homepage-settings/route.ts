import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

// GET homepage settings
export async function GET() {
  try {
    const { data: settings, error } = await supabaseAdmin
      .from('homepage_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Return default settings if none exist
    if (!settings) {
      return NextResponse.json({
        site_name: 'TecBunny',
        logo_url: null,
        logo_public_id: null,
        banner_title: 'Premium Tech Accessories',
        banner_subtitle: 'Discover the latest in technology accessories with unbeatable prices, premium quality, and lightning-fast delivery across India.',
        banner_background_color: 'from-blue-600 via-blue-500 to-purple-600',
        banner_text_color: 'white',
        banner_button_primary_text: 'Shop Now',
        banner_button_secondary_text: 'View Categories',
        feature_delivery_title: 'Free Delivery',
        feature_delivery_subtitle: 'On orders above ₹500',
        feature_genuine_title: 'Genuine Products',
        feature_genuine_subtitle: '100% authentic guarantee',
        feature_support_title: '24/7 Support',
        feature_support_subtitle: 'Always here to help',
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage settings' },
      { status: 500 }
    );
  }
}

// POST/PUT homepage settings (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('Homepage settings update request received');
    
    // Get token from cookies
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      console.log('No admin token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - Please login as admin' }, { status: 401 });
    }

    // Verify JWT token
    let decoded: { userId: string, role: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid token - Please login again' }, { status: 401 });
    }
    
    if (decoded.role !== 'admin') {
      console.log('User is not admin:', decoded.role);
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Get admin user from database
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role')
      .eq('id', decoded.userId)
      .eq('role', 'admin')
      .single();

    if (adminError || !admin) {
      console.log('Admin user not found or error:', adminError);
      return NextResponse.json({ error: 'Invalid token or user not found' }, { status: 401 });
    }

    console.log('Admin user verified:', admin.email);

    const body = await request.json();
    console.log('Request body received:', Object.keys(body));
    
    // Validate required fields
    const requiredFields = ['site_name', 'banner_title', 'banner_subtitle'];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Check if settings exist
    console.log('Checking for existing settings...');
    const { data: existingSettings, error: existingError } = await supabaseAdmin
      .from('homepage_settings')
      .select('id')
      .limit(1)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.log('Error checking existing settings:', existingError);
    }

    let result;
    
    if (existingSettings) {
      console.log('Updating existing settings with ID:', existingSettings.id);
      // Update existing settings
      const { data, error } = await supabaseAdmin
        .from('homepage_settings')
        .update({
          ...body,
          updated_by: admin.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single();

      if (error) {
        console.log('Error updating settings:', error);
        throw error;
      }
      console.log('Settings updated successfully');
      result = data;
    } else {
      console.log('Creating new settings...');
      // Create new settings
      const { data, error } = await supabaseAdmin
        .from('homepage_settings')
        .insert({
          ...body,
          updated_by: admin.id
        })
        .select()
        .single();

      if (error) {
        console.log('Error creating settings:', error);
        throw error;
      }
      console.log('Settings created successfully');
      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage settings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
