import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

// GET all products
export async function GET() {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(products || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST new product (admin only)
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Please login as admin' }, { status: 401 });
    }

    // Verify JWT token
    let decoded: { userId: string, role: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
    } catch {
      return NextResponse.json({ error: 'Invalid token - Please login again' }, { status: 401 });
    }
    
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Create new product
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name: body.name,
        description: body.description,
        price: body.price,
        original_price: body.originalPrice || body.price,
        image: body.image,
        image_public_id: body.image_public_id,
        category: body.category,
        rating: body.rating || 4.5,
        reviews: body.reviews || 0,
        in_stock: body.inStock !== false,
        brand: body.brand,
        features: body.features || [],
        created_by: decoded.userId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
