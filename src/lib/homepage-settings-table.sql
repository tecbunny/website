-- Create homepage_settings table for admin customization
CREATE TABLE IF NOT EXISTS public.homepage_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_name VARCHAR(255) DEFAULT 'TecBunny' NOT NULL,
  logo_url TEXT,
  banner_title VARCHAR(500) DEFAULT 'Premium Tech Accessories' NOT NULL,
  banner_subtitle VARCHAR(1000) DEFAULT 'Discover the latest in technology accessories with unbeatable prices, premium quality, and lightning-fast delivery across India.' NOT NULL,
  banner_background_color VARCHAR(100) DEFAULT 'from-blue-600 via-blue-500 to-purple-600' NOT NULL,
  banner_text_color VARCHAR(50) DEFAULT 'white' NOT NULL,
  banner_button_primary_text VARCHAR(100) DEFAULT 'Shop Now' NOT NULL,
  banner_button_secondary_text VARCHAR(100) DEFAULT 'View Categories' NOT NULL,
  feature_delivery_title VARCHAR(100) DEFAULT 'Free Delivery' NOT NULL,
  feature_delivery_subtitle VARCHAR(200) DEFAULT 'On orders above ₹500' NOT NULL,
  feature_genuine_title VARCHAR(100) DEFAULT 'Genuine Products' NOT NULL,
  feature_genuine_subtitle VARCHAR(200) DEFAULT '100% authentic guarantee' NOT NULL,
  feature_support_title VARCHAR(100) DEFAULT '24/7 Support' NOT NULL,
  feature_support_subtitle VARCHAR(200) DEFAULT 'Always here to help' NOT NULL,
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.homepage_settings (site_name, banner_title, banner_subtitle) 
VALUES ('TecBunny', 'Premium Tech Accessories', 'Discover the latest in technology accessories with unbeatable prices, premium quality, and lightning-fast delivery across India.')
ON CONFLICT DO NOTHING;

-- Enable RLS for homepage_settings
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;

-- Homepage settings policies
DROP POLICY IF EXISTS "Anyone can view homepage settings" ON public.homepage_settings;
CREATE POLICY "Anyone can view homepage settings" ON public.homepage_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage homepage settings" ON public.homepage_settings;
CREATE POLICY "Admins can manage homepage settings" ON public.homepage_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add updated_at trigger for homepage_settings
DROP TRIGGER IF EXISTS update_homepage_settings_updated_at ON public.homepage_settings;
CREATE TRIGGER update_homepage_settings_updated_at 
    BEFORE UPDATE ON public.homepage_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
