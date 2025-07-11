import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Initialize homepage settings if not exists
    const { data: existing } = await supabase
      .from('homepage_settings')
      .select('id')
      .limit(1)
      .single();

    if (!existing) {
      const { error } = await supabase
        .from('homepage_settings')
        .insert({
          site_name: 'TecBunny',
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

      if (error) {
        console.error('Error initializing homepage settings:', error);
        return NextResponse.json(
          { error: 'Failed to initialize homepage settings' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: 'Homepage settings initialized successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
