import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching homepage settings:', error);
      return NextResponse.json({ error: 'Failed to fetch homepage settings' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      site_name,
      logo_url,
      banner_title,
      banner_subtitle,
      banner_background_color,
      banner_text_color,
      banner_button_primary_text,
      banner_button_secondary_text,
      feature_delivery_title,
      feature_delivery_subtitle,
      feature_genuine_title,
      feature_genuine_subtitle,
      feature_support_title,
      feature_support_subtitle
    } = body;

    // First, check if any settings exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('homepage_settings')
      .select('id')
      .limit(1)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing settings:', checkError);
      return NextResponse.json({ error: 'Failed to check existing settings' }, { status: 500 });
    }

    let result;
    
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('homepage_settings')
        .update({
          site_name,
          logo_url,
          banner_title,
          banner_subtitle,
          banner_background_color,
          banner_text_color,
          banner_button_primary_text,
          banner_button_secondary_text,
          feature_delivery_title,
          feature_delivery_subtitle,
          feature_genuine_title,
          feature_genuine_subtitle,
          feature_support_title,
          feature_support_subtitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single();
    } else {
      // Create new settings
      result = await supabase
        .from('homepage_settings')
        .insert({
          site_name,
          logo_url,
          banner_title,
          banner_subtitle,
          banner_background_color,
          banner_text_color,
          banner_button_primary_text,
          banner_button_secondary_text,
          feature_delivery_title,
          feature_delivery_subtitle,
          feature_genuine_title,
          feature_genuine_subtitle,
          feature_support_title,
          feature_support_subtitle
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving homepage settings:', result.error);
      return NextResponse.json({ error: 'Failed to save homepage settings' }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
