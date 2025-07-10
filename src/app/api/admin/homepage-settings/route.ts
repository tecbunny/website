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
    // Get token from cookies
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
    
    if (decoded.role !== 'admin') {
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
      return NextResponse.json({ error: 'Invalid token or user not found' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['site_name', 'banner_title', 'banner_subtitle'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Check if settings exist
    const { data: existingSettings } = await supabaseAdmin
      .from('homepage_settings')
      .select('id')
      .limit(1)
      .single();

    let result;
    
    if (existingSettings) {
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

      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabaseAdmin
        .from('homepage_settings')
        .insert({
          ...body,
          updated_by: admin.id
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage settings' },
      { status: 500 }
    );
  }
}
