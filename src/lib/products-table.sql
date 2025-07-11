-- Create products table for e-commerce
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in paise (₹1 = 100 paise)
  original_price INTEGER, -- Original price for showing discounts
  image TEXT, -- Cloudinary URL
  image_public_id VARCHAR(255), -- Cloudinary public ID for image management
  category VARCHAR(100) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  brand VARCHAR(100),
  features TEXT[], -- Array of feature strings
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products policies
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add updated_at trigger for products
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, original_price, image, category, rating, reviews, in_stock, brand, features) 
VALUES 
('Wireless Gaming Mouse Pro', 'High-precision wireless gaming mouse with RGB lighting', 299900, 349900, '/products/gaming-mouse.svg', 'computer', 4.5, 128, true, 'TechPro', ARRAY['Wireless', 'RGB Lighting', 'Gaming', 'Ergonomic']),
('Mechanical Keyboard RGB', 'Backlit mechanical keyboard with blue switches', 499900, 599900, '/products/keyboard.svg', 'computer', 4.7, 89, true, 'KeyMaster', ARRAY['Mechanical', 'RGB', 'Blue Switches', 'Gaming']),
('4K Webcam Pro', 'Ultra HD webcam with auto-focus and noise cancellation', 699900, 899900, '/products/webcam.svg', 'computer', 4.6, 156, true, 'WebCam+', ARRAY['4K', 'Auto Focus', 'Noise Cancellation', 'USB-C']),
('WiFi 6 Router AC3000', 'High-speed WiFi 6 router with advanced security', 1299900, 1599900, '/products/router.svg', 'network', 4.8, 234, true, 'NetSpeed', ARRAY['WiFi 6', 'AC3000', 'Security', 'Mesh Ready']),
('Wireless Earbuds Pro', 'Premium wireless earbuds with active noise cancellation', 899900, 1199900, '/products/airpods.svg', 'mobile', 4.7, 345, true, 'AudioTech', ARRAY['ANC', 'Wireless', 'Premium', 'Long Battery']),
('Bluetooth Speaker', 'Portable bluetooth speaker with premium sound quality', 349900, 449900, '/products/speaker.svg', 'mobile', 4.6, 178, true, 'SoundMax', ARRAY['Bluetooth', 'Portable', 'Premium Sound', 'Waterproof'])
ON CONFLICT DO NOTHING;
