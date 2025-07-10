"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, Shield, Headphones, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";

const categories = [
  { name: "Computer Accessories", icon: "/computer.svg", href: "/products?cat=computer", count: "500+ Items" },
  { name: "Networking Devices", icon: "/network.svg", href: "/products?cat=network", count: "200+ Items" },
  { name: "Mobile Accessories", icon: "/mobile.svg", href: "/products?cat=mobile", count: "800+ Items" },
  { name: "Personal Goods", icon: "/personal.svg", href: "/products?cat=personal", count: "300+ Items" },
];

const featuredProducts = [
  { id: "1", name: "Wireless Mouse Pro", price: 799, originalPrice: 999, image: "/computer.svg", rating: 4.5 },
  { id: "2", name: "Gaming Router X1", price: 1999, originalPrice: 2499, image: "/network.svg", rating: 4.8 },
  { id: "3", name: "AirPods Pro Max", price: 1499, originalPrice: 1799, image: "/mobile.svg", rating: 4.7 },
];

const testimonials = [
  { name: "Rajesh Kumar", text: "Amazing quality products and fast delivery!", rating: 5 },
  { name: "Priya Sharma", text: "Best prices in the market. Highly recommended!", rating: 5 },
  { name: "Amit Singh", text: "Excellent customer service and genuine products.", rating: 5 },
];

export default function Home() {
  const { addToCart } = useCart();
  const { settings, isLoading } = useHomepageSettings();

  const handleAddToCart = (product: { id: string; name: string; price: number; originalPrice?: number; image: string; rating: number }) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className={`relative w-full bg-gradient-to-r ${settings?.banner_background_color || 'from-blue-600 via-blue-500 to-purple-600'} text-${settings?.banner_text_color || 'white'} py-16 px-4 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              {settings?.banner_title || 'Premium Tech'} <br />
              <span className="text-yellow-300">Accessories</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-lg">
              {settings?.banner_subtitle || 'Discover the latest in technology accessories with unbeatable prices, premium quality, and lightning-fast delivery across India.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="bg-white text-blue-700 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105">
                {settings?.banner_button_primary_text || 'Shop Now'} <ArrowRight className="inline ml-2 h-5 w-5" />
              </Link>
              <Link href="/products" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-blue-700 transition-all">
                {settings?.banner_button_secondary_text || 'View Categories'}
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform">
                <Image src="/computer.svg" alt="Computer" width={60} height={60} className="mb-2" />
                <p className="text-sm font-semibold">Computer Accessories</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 transform -rotate-3 hover:rotate-0 transition-transform mt-8">
                <Image src="/mobile.svg" alt="Mobile" width={60} height={60} className="mb-2" />
                <p className="text-sm font-semibold">Mobile Accessories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white shadow-lg -mt-8 relative z-10 mx-4 lg:mx-8 rounded-2xl">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Truck className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-800">{settings?.feature_delivery_title || 'Free Delivery'}</h3>
                <p className="text-sm text-gray-600">{settings?.feature_delivery_subtitle || 'On orders above ₹500'}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-bold text-gray-800">{settings?.feature_genuine_title || 'Genuine Products'}</h3>
                <p className="text-sm text-gray-600">{settings?.feature_genuine_subtitle || '100% authentic guarantee'}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Headphones className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-bold text-gray-800">{settings?.feature_support_title || '24/7 Support'}</h3>
                <p className="text-sm text-gray-600">{settings?.feature_support_subtitle || 'Always here to help'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Image src={category.icon} alt={category.name} width={48} height={48} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-700">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{category.count}</p>
                  <span className="text-blue-600 font-semibold group-hover:underline">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Deal Banner 1 */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Gaming Week Sale!</h3>
                <p className="text-orange-100 mb-4">Up to 50% off on gaming accessories</p>
                <Link href="/products?cat=computer" className="bg-white text-orange-600 font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors inline-block">
                  Shop Gaming →
                </Link>
              </div>
            </div>

            {/* Deal Banner 2 */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Mobile Mania!</h3>
                <p className="text-green-100 mb-4">Latest mobile accessories at best prices</p>
                <Link href="/products?cat=mobile" className="bg-white text-green-600 font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors inline-block">
                  Explore Mobile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Handpicked products with the best value and quality for our customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group">
                <div className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                    <Image src={product.image} alt={product.name} width={64} height={64} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-center">{product.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} fill={i < Math.floor(product.rating) ? "#facc15" : "none"} />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-blue-700">₹{product.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/products/${product.id}`}
                      className="flex-1 border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">⚡ Flash Deals</h2>
            <p className="text-purple-100 text-lg mb-6">Limited time offers - Hurry up!</p>
            <div className="flex justify-center items-center space-x-4 text-2xl font-bold">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="block text-sm opacity-75">Hours</span>
                <span>12</span>
              </div>
              <span>:</span>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="block text-sm opacity-75">Minutes</span>
                <span>30</span>
              </div>
              <span>:</span>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="block text-sm opacity-75">Seconds</span>
                <span>45</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Smart Watch", price: 1299, originalPrice: 2199, savings: 41 },
              { name: "Wireless Charger", price: 599, originalPrice: 999, savings: 40 },
              { name: "Bluetooth Speaker", price: 899, originalPrice: 1499, savings: 40 },
              { name: "Power Bank 20000mAh", price: 799, originalPrice: 1299, savings: 38 }
            ].map((deal, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-gray-800 hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Image src="/mobile.svg" alt={deal.name} width={32} height={32} />
                </div>
                <h4 className="font-semibold text-sm mb-2 text-center">{deal.name}</h4>
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-600">₹{deal.price}</span>
                  <span className="text-xs text-gray-500 line-through ml-1">₹{deal.originalPrice}</span>
                  <div className="text-xs text-green-600 font-medium">{deal.savings}% OFF</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/products" className="bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:bg-purple-50 transition-colors inline-block">
              View All Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
                <div className="flex justify-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400" fill="#facc15" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&quot;{testimonial.text}&quot;</p>
                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with TecBunny!</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Get exclusive deals, latest product launches, and tech news delivered to your inbox.
          </p>
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-300"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              🔒 We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
