"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Filter, Search, Grid, List } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  in_stock: boolean;
  brand: string;
  features: string[];
}

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");

  const categories = [
    { id: "all", name: "All Products", count: 0 },
    { id: "computer", name: "Computer Accessories", count: 0 },
    { id: "network", name: "Networking", count: 0 },
    { id: "mobile", name: "Mobile Accessories", count: 0 },
    { id: "personal", name: "Personal Goods", count: 0 },
  ];

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        
        // Update category counts
        categories.forEach(cat => {
          cat.count = cat.id === 'all' ? data.length : data.filter((p: Product) => p.category === cat.id).length;
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [priceRange, setPriceRange] = useState([0, 20000]);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [selectedCategory, searchTerm, priceRange, sortBy, products]);

  const handleAddToCart = (product: Product) => {
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                Showing {filteredProducts.length} of {products.length} products
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
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
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
                            {product.original_price && product.original_price > product.price && (
                              <span className="text-sm text-gray-500 line-through">₹{product.original_price.toLocaleString()}</span>
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
