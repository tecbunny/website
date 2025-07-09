import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  Users, 
  Settings, 
  Smartphone, 
  Monitor, 
  Wifi, 
  Camera,
  Headphones,
  Laptop,
  Truck,
  Shield,
  Clock
} from "lucide-react"
import Link from "next/link"

const categories = [
  { name: "Computer Electronics", icon: Monitor, count: "1,200+" },
  { name: "CCTV Parts", icon: Camera, count: "800+" },
  { name: "Computers & Laptops", icon: Laptop, count: "500+" },
  { name: "Networking Equipment", icon: Wifi, count: "600+" },
  { name: "Mobile Accessories", icon: Smartphone, count: "2,000+" },
  { name: "General Electronics", icon: Headphones, count: "1,500+" },
]

const features = [
  {
    icon: ShoppingCart,
    title: "Easy E-commerce",
    description: "Browse, search, and purchase products with a seamless shopping experience"
  },
  {
    icon: Users,
    title: "Vendor Platform",
    description: "Complete vendor management with inventory tracking and sales analytics"
  },
  {
    icon: Settings,
    title: "Admin Dashboard",
    description: "Comprehensive admin tools for managing the entire platform"
  },
  {
    icon: Truck,
    title: "Order Tracking",
    description: "Real-time order tracking and delivery updates"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "PhonePe integration for secure UPI, card, and wallet payments"
  },
  {
    icon: Clock,
    title: "Service Requests",
    description: "Book repair services for computers, CCTV, networks, and mobile devices"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">TecBunny Solutions</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
            CRM & E-commerce Platform
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Complete
            <span className="text-indigo-600"> Electronics </span>
            Marketplace
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            TecBunny Solutions offers a comprehensive CRM and e-commerce platform for retail & wholesale 
            of computer electronics, CCTV parts, networking equipment, and mobile accessories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Shop Now
              </Button>
            </Link>
            <Link href="/vendor/register">
              <Button size="lg" variant="outline">
                Become a Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Product Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <category.icon className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>{category.count} products available</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-indigo-600 mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-indigo-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-indigo-200">Trusted Vendors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-indigo-200">Products Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-indigo-200">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of customers and vendors who trust TecBunny Solutions 
            for their electronics needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Create Account
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">TecBunny Solutions</h4>
              <p className="text-gray-400">
                Your trusted partner for electronics retail and wholesale business.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products" className="hover:text-white">Products</Link></li>
                <li><Link href="/services" className="hover:text-white">Services</Link></li>
                <li><Link href="/vendor/register" className="hover:text-white">Become a Vendor</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/categories/computers" className="hover:text-white">Computers</Link></li>
                <li><Link href="/categories/cctv" className="hover:text-white">CCTV</Link></li>
                <li><Link href="/categories/networking" className="hover:text-white">Networking</Link></li>
                <li><Link href="/categories/mobile" className="hover:text-white">Mobile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@tecbunny.com</li>
                <li>Phone: +91 9876543210</li>
                <li>Address: Tech Hub, Electronic City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TecBunny Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
