import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NextAuthProvider } from "@/contexts/NextAuthContext";
import { ClientSessionProvider } from "@/components/ClientSessionProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TecBunny | Computer & Mobile Accessories Store",
  description:
    "TecBunny is your one-stop e-commerce platform for Computer Accessories, Networking Devices, Mobile Accessories, and Personal Goods.",
};

function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-xl mb-4 text-blue-400">TecBunny</h3>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted partner for premium tech accessories, networking devices, and mobile essentials.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.747.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624.001 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.001"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?cat=computer" className="text-gray-300 hover:text-blue-400 transition-colors">Computer Accessories</Link></li>
              <li><Link href="/products?cat=network" className="text-gray-300 hover:text-blue-400 transition-colors">Networking Devices</Link></li>
              <li><Link href="/products?cat=mobile" className="text-gray-300 hover:text-blue-400 transition-colors">Mobile Accessories</Link></li>
              <li><Link href="/products?cat=personal" className="text-gray-300 hover:text-blue-400 transition-colors">Personal Goods</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-blue-400 transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Track Your Order</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Return Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Press</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><Link href="/admin/login" className="text-gray-300 hover:text-blue-400 transition-colors">Admin Access</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TecBunny Solutions. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Image src="/payment-visa.svg" alt="Visa" width={24} height={24} className="h-6 w-auto opacity-70" />
            <Image src="/payment-mastercard.svg" alt="Mastercard" width={24} height={24} className="h-6 w-auto opacity-70" />
            <Image src="/payment-paypal.svg" alt="PayPal" width={24} height={24} className="h-6 w-auto opacity-70" />
            <Image src="/payment-upi.svg" alt="UPI" width={24} height={24} className="h-6 w-auto opacity-70" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-blue-50 to-white min-h-screen`}
      >
        <ClientSessionProvider>
          <NextAuthProvider>
            <AuthProvider>
              <CartProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </CartProvider>
            </AuthProvider>
          </NextAuthProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
