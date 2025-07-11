"use client";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNextAuth } from "@/contexts/NextAuthContext";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, Settings, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";
import Image from "next/image";

export default function Navbar() {
  const { cart } = useCart();
  const { user: authUser, isAuthenticated: authAuthenticated, logout: authLogout } = useAuth();
  const { user: nextAuthUser, isAuthenticated: nextAuthAuthenticated, logout: nextAuthLogout } = useNextAuth();
  const { data: session } = useSession();
  const { settings } = useHomepageSettings();
  
  // Use NextAuth session if available, fallback to custom auth
  const user = session?.user || nextAuthUser || authUser;
  const isAuthenticated = !!session || nextAuthAuthenticated || authAuthenticated;
  
  const handleLogout = async () => {
    if (session) {
      await nextAuthLogout();
    } else {
      await authLogout();
    }
    setIsUserMenuOpen(false);
  };
  
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/products?cat=computer", label: "Computer" },
    { href: "/products?cat=network", label: "Network" },
    { href: "/products?cat=mobile", label: "Mobile" },
    { href: "/products?cat=personal", label: "Personal" },
    ...(user?.role === 'admin' ? [
      { href: "/admin/crm", label: "Admin CRM" },
      { href: "/admin/homepage-editor", label: "Homepage Editor" },
      { href: "/admin/products", label: "Product Manager" }
    ] : []),
  ];

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Remove the duplicate handleLogout function
  // It's already defined above

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <span>🚚 Free shipping on orders above ₹500</span>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="hover:text-blue-300">Track Order</a>
            <a href="#" className="hover:text-blue-300">Help</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {settings?.logo_url ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <Image 
                  src={settings.logo_url} 
                  alt={settings.site_name || 'TecBunny'} 
                  width={40} 
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {(settings?.site_name || 'TecBunny')[0]}
                </span>
              </div>
            )}
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {settings?.site_name || 'TecBunny'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:text-blue-600 ${
                  pathname === link.href ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Categories
              </button>
              <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-2">
                <div className="py-2">
                  {navLinks.slice(2).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <form className="flex-1 max-w-xl mx-8 hidden md:flex" onSubmit={e => e.preventDefault()}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-2.5 pl-12 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
              <Heart className="h-6 w-6" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Account - User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      {user?.role === 'admin' && (
                        <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href="/account/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="mr-3 h-4 w-4" />
                        My Profile
                      </Link>
                      <Link 
                        href="/account/orders" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="mr-3 h-4 w-4" />
                        My Orders
                      </Link>
                      <Link 
                        href="/account/settings" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                      {user?.role === 'admin' && (
                        <Link 
                          href="/admin/crm" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 py-1">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  href="/auth/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 font-medium transition-colors ${
                  pathname === link.href ? "text-blue-600" : "text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Authentication Links */}
            {isAuthenticated ? (
              <div className="border-t border-gray-200 mt-3 pt-3">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <Link
                  href="/account/profile"
                  className="block py-2 font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/account/orders"
                  className="block py-2 font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin/crm"
                    className="block py-2 font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 font-medium text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 mt-3 pt-3 space-y-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 font-medium text-gray-700 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
