# Database Migration Instructions

## Problem
The error "column 'brand' does not exist" occurs because the database table doesn't have all the required columns that the application expects.

## Solution
Run the single migration SQL script in your Supabase SQL Editor.

## Steps

1. **Go to your Supabase Dashboard**
   - Open https://supabase.com/dashboard
   - Select your project: `tecbunny-solutions`

2. **Open SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click on "New query" or use the existing query editor

3. **Copy and paste the SQL script from `DATABASE_MIGRATION.sql`:**

```sql
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
```

4. **Run the script**
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait for completion - you should see success messages

## What this script does:

- **Adds all missing columns** to the products table (image, brand, features, etc.)
- **Adds logo_public_id** to homepage_settings for Cloudinary management
- **Inserts 6 sample products** (only if table is empty)
- **Creates performance indexes** for better query speed
- **Sets up security policies** for public viewing and admin management
- **Creates triggers** for automatic timestamp updates

## After running the migration:

1. Your products page will load without errors
2. The admin product manager will work correctly
3. All product-related API endpoints will function properly
4. You'll have sample products to test with

## Note:
- Safe to run multiple times - uses `IF NOT EXISTS` clauses
- Only adds sample data if the table is completely empty
- All prices are in paise (₹1 = 100 paise) for precise calculations
