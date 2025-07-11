-- Complete database migration script - Run this once
-- Adds all missing columns and sample data

-- Add ALL missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_public_id VARCHAR(255);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand VARCHAR(100);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS features TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add missing column to homepage_settings
ALTER TABLE public.homepage_settings ADD COLUMN IF NOT EXISTS logo_public_id VARCHAR(255);

-- Insert sample products if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.products LIMIT 1) THEN
        INSERT INTO public.products (name, description, price, original_price, image, category, rating, reviews, in_stock, brand, features) VALUES
        ('Wireless Gaming Mouse Pro', 'High-precision wireless gaming mouse with RGB lighting', 299900, 349900, '/products/gaming-mouse.svg', 'computer', 4.5, 128, true, 'TechPro', ARRAY['Wireless', 'RGB Lighting', 'Gaming', 'Ergonomic']),
        ('Mechanical Keyboard RGB', 'Backlit mechanical keyboard with blue switches', 499900, 599900, '/products/keyboard.svg', 'computer', 4.7, 89, true, 'KeyMaster', ARRAY['Mechanical', 'RGB', 'Blue Switches', 'Gaming']),
        ('4K Webcam Pro', 'Ultra HD webcam with auto-focus and noise cancellation', 699900, 899900, '/products/webcam.svg', 'computer', 4.6, 156, true, 'WebCam+', ARRAY['4K', 'Auto Focus', 'Noise Cancellation', 'USB-C']),
        ('WiFi 6 Router AC3000', 'High-speed WiFi 6 router with advanced security', 1299900, 1599900, '/products/router.svg', 'network', 4.8, 234, true, 'NetSpeed', ARRAY['WiFi 6', 'AC3000', 'Security', 'Mesh Ready']),
        ('Wireless Earbuds Pro', 'Premium wireless earbuds with active noise cancellation', 899900, 1199900, '/products/airpods.svg', 'mobile', 4.7, 345, true, 'AudioTech', ARRAY['ANC', 'Wireless', 'Premium', 'Long Battery']),
        ('Bluetooth Speaker', 'Portable bluetooth speaker with premium sound quality', 349900, 449900, '/products/speaker.svg', 'mobile', 4.6, 178, true, 'SoundMax', ARRAY['Bluetooth', 'Portable', 'Premium Sound', 'Waterproof']);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Enable RLS and create policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ language 'plpgsql';
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
