"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  ShoppingBag, 
  TrendingUp,
  Edit,
  MoreVertical,
  Package,
  CreditCard,
  MessageSquare
} from "lucide-react";

// Mock customer data
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  lastActive: string;
  lastOrder: string;
  status: string;
  segment: string;
  averageOrder: number;
  preferredCategory: string;
  orders: Array<{
    id: string;
    date: string;
    status: string;
    total: number;
    items: string[];
  }>;
  notes: Array<{
    id: string;
    content: string;
    author: string;
    date: string;
    type: string;
  }>;
  preferences: {
    categories: string[];
    brands: string[];
    priceRange: string;
  };
}

const getCustomerById = (id: string): Customer | null => {
  const customers: Record<string, Customer> = {
    "1": {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      address: "123 MG Road, Bangalore, Karnataka 560001",
      totalOrders: 12,
      totalSpent: 25600,
      lastOrder: "2024-12-15",
      lastActive: "2024-12-16",
      status: "Active",
      joinDate: "2023-06-15",
      segment: "VIP",
      averageOrder: 2133,
      preferredCategory: "Gaming",
      orders: [
        {
          id: "ORD-001",
          date: "2024-12-15",
          status: "Delivered",
          total: 2499,
          items: ["Gaming Router X1", "Wireless Mouse"]
        },
        {
          id: "ORD-002",
          date: "2024-11-28",
          status: "Delivered",
          total: 1299,
          items: ["Bluetooth Earbuds"]
        },
        {
          id: "ORD-003",
          date: "2024-11-15",
          status: "Delivered",
          total: 3299,
          items: ["Mechanical Keyboard", "Gaming Headset"]
        }
      ],
      preferences: {
        categories: ["Computer Accessories", "Gaming"],
        brands: ["TechPro", "Gaming Plus"],
        priceRange: "₹1000-₹5000"
      },
      notes: [
        {
          id: "1",
          content: "Customer requested faster delivery for gaming products",
          author: "Admin",
          date: "2024-12-10",
          type: "note"
        },
        {
          id: "2",
          content: "Resolved shipping issue. Customer very satisfied.",
          author: "Support",
          date: "2024-11-20",
          type: "note"
        }
      ]
    }
  };
  return customers[id] || null;
};

export default function CustomerDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const customer = getCustomerById(params.id as string);

  if (!customer) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Customer not found</h1>
        <Link href="/admin/crm" className="text-blue-600 hover:underline">
          ← Back to CRM Dashboard
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders" },
    { id: "preferences", label: "Preferences" },
    { id: "notes", label: "Notes" }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/crm" 
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600 mt-1">Customer ID: {customer.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Customer Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">
                {customer.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{customer.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                customer.segment === 'VIP' ? 'bg-purple-100 text-purple-700' :
                customer.segment === 'Regular' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {customer.segment}
              </span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Joined {customer.joinDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-green-600 text-sm font-medium">+8% this month</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{customer.totalOrders}</h3>
          <p className="text-gray-600 text-sm">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="h-8 w-8 text-green-600" />
            <span className="text-green-600 text-sm font-medium">+12% this month</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{customer.totalSpent.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Total Spent</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <span className={`text-sm font-medium ${
              customer.status === 'Active' ? 'text-green-600' : 'text-red-600'
            }`}>
              {customer.status}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Avg. Order Value</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{customer.address}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div><span className="font-medium">Status:</span> <span className={customer.status === 'Active' ? 'text-green-600' : 'text-red-600'}>{customer.status}</span></div>
                    <div><span className="font-medium">Segment:</span> <span className="text-blue-600">{customer.segment}</span></div>
                    <div><span className="font-medium">Last Order:</span> <span className="text-gray-700">{customer.lastOrder}</span></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {customer.orders.slice(0, 3).map((order: { id: string; date: string; status: string; total: number; items: string[] }) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.items.join(', ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customer.orders.map((order: { id: string; date: string; status: string; total: number; items: string[] }) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                        <td className="py-3 px-4 text-gray-700">{order.date}</td>
                        <td className="py-3 px-4 text-gray-700">{order.items.join(', ')}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">₹{order.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Favorite Categories</h4>
                    <div className="space-y-2">
                      {customer.preferences.categories.map((category: string) => (
                        <span key={category} className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Preferred Brands</h4>
                    <div className="space-y-2">
                      {customer.preferences.brands.map((brand: string) => (
                        <span key={brand} className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {customer.preferences.priceRange}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Notes</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Add Note</span>
                </button>
              </div>
              <div className="space-y-4">
                {customer.notes.map((note: { id: string; content: string; author: string; date: string; type: string }) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{note.author}</span>
                      <span className="text-sm text-gray-500">{note.date}</span>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
