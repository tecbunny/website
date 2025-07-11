import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

// GET single product
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
}

// PUT update product (admin only)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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
    
    // Update product
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE product (admin only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    // Delete product
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
