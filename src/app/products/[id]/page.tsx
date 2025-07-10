"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { Star, Heart, Share2, Truck, Shield, RotateCcw, ShoppingCart, Minus, Plus } from "lucide-react";
import { useParams } from "next/navigation";

// Mock product data - in real app this would come from API/database
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProductById = (id: string): any => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: Record<string, any> = {
    "1": {
      id: "1",
      name: "Wireless Gaming Mouse Pro",
      price: 1299,
      originalPrice: 1799,
      rating: 4.5,
      reviews: 234,
      image: "/computer.svg",
      images: ["/computer.svg", "/computer.svg", "/computer.svg"],
      description: "Premium wireless gaming mouse with RGB lighting, 16000 DPI sensor, and ultra-fast response time. Perfect for competitive gaming and professional work.",
      features: [
        "16000 DPI precision sensor",
        "RGB customizable lighting",
        "Wireless 2.4GHz connectivity",
        "50-hour battery life",
        "Ergonomic design",
        "6 programmable buttons"
      ],
      inStock: true,
      stockCount: 25,
      category: "Computer Accessories",
      brand: "TechPro",
      model: "WGM-2024",
      warranty: "2 Years"
    },
    "2": {
      id: "2",
      name: "Gaming Router X1 Pro",
      price: 2499,
      originalPrice: 3199,
      rating: 4.8,
      reviews: 156,
      image: "/network.svg",
      images: ["/network.svg", "/network.svg", "/network.svg"],
      description: "Ultra-fast gaming router with Wi-Fi 6E technology, advanced QoS, and gaming acceleration features for the ultimate online gaming experience.",
      features: [
        "Wi-Fi 6E technology",
        "Gaming acceleration mode",
        "Advanced QoS control",
        "8 high-gain antennas",
        "Gigabit ethernet ports",
        "Mobile app control"
      ],
      inStock: true,
      stockCount: 15,
      category: "Networking Devices",
      brand: "NetGear Pro",
      model: "NGP-X1",
      warranty: "3 Years"
    }
  };
  return products[id] || null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  if (!params?.id) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
        <p className="text-gray-600">Invalid product ID</p>
        <Link href="/products" className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
          Back to Products
        </Link>
      </div>
    );
  }
  
  const product = getProductById(params.id as string);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center">
            <Image 
              src={product.images[selectedImage]} 
              alt={product.name} 
              width={400} 
              height={400}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex space-x-4">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg border-2 p-2 ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <Image src={image} alt={`${product.name} ${index + 1}`} width={64} height={64} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <span>{product.brand}</span>
              <span>•</span>
              <span>Model: {product.model}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                    fill={i < Math.floor(product.rating) ? "#facc15" : "none"} 
                  />
                ))}
                <span className="text-gray-600 ml-2">({product.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
              <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                {discount}% OFF
              </span>
            </div>
            <p className="text-sm text-green-600">You save ₹{(product.originalPrice - product.price).toLocaleString()}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {product.inStock ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">In Stock ({product.stockCount} items left)</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 rounded-l-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[50px] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="p-2 hover:bg-gray-100 rounded-r-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 border-2 rounded-lg transition-colors ${
                  isWishlisted 
                    ? 'border-red-500 text-red-500 bg-red-50' 
                    : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center space-x-3">
              <Truck className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Free Delivery</p>
                <p className="text-sm text-gray-600">On orders above ₹500</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Warranty</p>
                <p className="text-sm text-gray-600">{product.warranty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-800">Easy Returns</p>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Description</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Brand:</dt>
                  <dd className="text-gray-800">{product.brand}</dd>
                </div>
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Model:</dt>
                  <dd className="text-gray-800">{product.model}</dd>
                </div>
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Category:</dt>
                  <dd className="text-gray-800">{product.category}</dd>
                </div>
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Warranty:</dt>
                  <dd className="text-gray-800">{product.warranty}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What&apos;s in the Box</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• 1x {product.name}</li>
                <li>• 1x USB Cable</li>
                <li>• 1x User Manual</li>
                <li>• 1x Warranty Card</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
