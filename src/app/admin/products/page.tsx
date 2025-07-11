"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Plus, Edit, Trash2, X } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  image_public_id?: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  brand: string;
  features: string[];
}

const categories = [
  { id: 'computer', name: 'Computer Accessories' },
  { id: 'network', name: 'Networking' },
  { id: 'mobile', name: 'Mobile Accessories' },
  { id: 'personal', name: 'Personal Goods' },
];

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: 'computer',
    rating: 4.5,
    reviews: 0,
    inStock: true,
    brand: '',
    features: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (): Promise<{ url: string | null; public_id: string | null }> => {
    if (!imageFile) return { url: null, public_id: null };

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('type', 'product');
      formData.append('productId', editingProduct?.id || 'new');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return { url: result.url, public_id: result.public_id };
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    return { url: null, public_id: null };
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Upload image if changed
      const imageResult = await uploadImage();
      
      const productData = {
        ...formData,
        ...(imageResult.url && { 
          image: imageResult.url,
          image_public_id: imageResult.public_id 
        }),
      };

      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        setMessage({ type: 'success', text: `Product ${editingProduct ? 'updated' : 'created'} successfully!` });
        
        if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? savedProduct : p));
        } else {
          setProducts([...products, savedProduct]);
        }
        
        handleCancel();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save product' });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage({ type: 'error', text: 'Failed to save product' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      features: product.features || [],
    });
    setShowAddForm(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      // Delete image from Cloudinary if it exists
      if (product.image_public_id) {
        await fetch(`/api/upload?publicId=${product.image_public_id}`, {
          method: 'DELETE',
        });
      }

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== product.id));
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to delete product' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      image: '',
      category: 'computer',
      rating: 4.5,
      reviews: 0,
      inStock: true,
      brand: '',
      features: [],
    });
    setImageFile(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Manager</h1>
          <p className="text-gray-600">Manage your product catalog and images</p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
            <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Products ({products.length})
          </h2>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="image">Product Image</Label>
                <div className="space-y-4">
                  {formData.image && (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Current product image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Product'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product)}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found. Add your first product!</p>
          </div>
        )}
      </div>
    </div>
  );
}
