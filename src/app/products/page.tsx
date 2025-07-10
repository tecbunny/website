"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Filter, Search, Grid, List } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Wireless Gaming Mouse Pro",
    description: "High-precision wireless gaming mouse with RGB lighting",
    price: 2999,
    originalPrice: 3499,
    image: "/api/placeholder/300/300",
    category: "computer",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    brand: "TechPro",
    features: ["Wireless", "RGB Lighting", "Gaming", "Ergonomic"]
  },
  {
    id: "2",
    name: "Mechanical Keyboard RGB",
    description: "Backlit mechanical keyboard with blue switches",
    price: 4999,
    originalPrice: 5999,
    image: "/api/placeholder/300/300",
    category: "computer",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    brand: "KeyMaster",
    features: ["Mechanical", "RGB", "Blue Switches", "Gaming"]
  },
  {
    id: "3",
    name: "4K Webcam Pro",
    description: "Ultra HD webcam with auto-focus and noise cancellation",
    price: 6999,
    originalPrice: 8999,
    image: "/api/placeholder/300/300",
    category: "computer",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    brand: "WebCam+",
    features: ["4K", "Auto Focus", "Noise Cancellation", "USB-C"]
  },
  {
    id: "4",
    name: "WiFi 6 Router AC3000",
    description: "High-speed WiFi 6 router with advanced security",
    price: 12999,
    originalPrice: 15999,
    image: "/api/placeholder/300/300",
    category: "network",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    brand: "NetSpeed",
    features: ["WiFi 6", "AC3000", "Security", "Mesh Ready"]
  },
  {
    id: "5",
    name: "USB-C Hub 7-in-1",
    description: "Multi-port USB-C hub with HDMI, USB 3.0, and charging",
    price: 3499,
    originalPrice: 4199,
    image: "/api/placeholder/300/300",
    category: "computer",
    rating: 4.4,
    reviews: 67,
    inStock: true,
    brand: "HubMax",
    features: ["7 Ports", "HDMI", "USB 3.0", "Fast Charging"]
  },
  {
    id: "6",
    name: "Wireless Earbuds Pro",
    description: "Premium wireless earbuds with active noise cancellation",
    price: 8999,
    originalPrice: 11999,
    image: "/api/placeholder/300/300",
    category: "mobile",
    rating: 4.7,
    reviews: 345,
    inStock: true,
    brand: "AudioTech",
    features: ["ANC", "Wireless", "Premium", "Long Battery"]
  },
  {
    id: "7",
    name: "Smartphone Stand Adjustable",
    description: "Adjustable phone stand for desk and video calls",
    price: 1299,
    originalPrice: 1799,
    image: "/api/placeholder/300/300",
    category: "mobile",
    rating: 4.3,
    reviews: 89,
    inStock: true,
    brand: "StandPro",
    features: ["Adjustable", "Stable", "Portable", "Universal"]
  },
  {
    id: "8",
    name: "Portable Power Bank 20000mAh",
    description: "High-capacity power bank with fast charging support",
    price: 2599,
    originalPrice: 3299,
    image: "/api/placeholder/300/300",
    category: "mobile",
    rating: 4.6,
    reviews: 178,
    inStock: true,
    brand: "PowerMax",
    features: ["20000mAh", "Fast Charge", "Portable", "Multiple Ports"]
  }
];

const categories = [
  { id: "all", name: "All Products", count: mockProducts.length },
  { id: "computer", name: "Computer Accessories", count: mockProducts.filter(p => p.category === "computer").length },
  { id: "network", name: "Networking", count: mockProducts.filter(p => p.category === "network").length },
  { id: "mobile", name: "Mobile Accessories", count: mockProducts.filter(p => p.category === "mobile").length },
];

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const { addToCart } = useCart();

  useEffect(() => {
    let filtered = mockProducts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const handleAddToCart = (product: typeof mockProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
              <p className="text-gray-600 mt-2">Discover our wide range of premium tech accessories</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category.id
                          ? "bg-purple-100 text-purple-800"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹0</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {mockProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-400"}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-400"}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                      viewMode === "list" ? "flex gap-4 p-4" : "overflow-hidden"
                    }`}
                  >
                    <div className={viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-square"}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className={viewMode === "list" ? "flex-1" : "p-4"}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({product.reviews})</span>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1 px-3 py-2 text-center bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
