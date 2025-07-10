"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Users, 
  Plus,
  Edit,
  Trash2,
  Target,
  TrendingUp,
  ShoppingBag
} from "lucide-react";

const segments = [
  {
    id: 1,
    name: "VIP Customers",
    description: "High-value customers with 10+ orders and ₹15K+ total spend",
    customerCount: 285,
    criteria: [
      { field: "Total Orders", operator: ">=", value: "10" },
      { field: "Total Spent", operator: ">=", value: "15000" },
      { field: "Last Order", operator: "<=", value: "30 days ago" }
    ],
    averageOrderValue: 2650,
    totalRevenue: 756250,
    color: "purple",
    createdDate: "2023-08-15",
    lastUpdated: "2024-12-01"
  },
  {
    id: 2,
    name: "Regular Customers",
    description: "Loyal customers with consistent purchase behavior",
    customerCount: 1708,
    criteria: [
      { field: "Total Orders", operator: ">=", value: "3" },
      { field: "Total Spent", operator: ">=", value: "2000" },
      { field: "Account Age", operator: ">=", value: "6 months" }
    ],
    averageOrderValue: 1450,
    totalRevenue: 2476600,
    color: "blue",
    createdDate: "2023-06-10",
    lastUpdated: "2024-11-28"
  },
  {
    id: 3,
    name: "New Customers",
    description: "Recently joined customers in their first 90 days",
    customerCount: 854,
    criteria: [
      { field: "Account Age", operator: "<=", value: "90 days" },
      { field: "Total Orders", operator: "<=", value: "2" }
    ],
    averageOrderValue: 980,
    totalRevenue: 836920,
    color: "green",
    createdDate: "2023-06-10",
    lastUpdated: "2024-12-10"
  },
  {
    id: 4,
    name: "At-Risk Customers",
    description: "Customers who haven&apos;t ordered in the last 60 days",
    customerCount: 456,
    criteria: [
      { field: "Last Order", operator: ">=", value: "60 days ago" },
      { field: "Total Orders", operator: ">=", value: "2" }
    ],
    averageOrderValue: 1200,
    totalRevenue: 547200,
    color: "red",
    createdDate: "2023-09-20",
    lastUpdated: "2024-12-08"
  }
];

export default function CustomerSegments() {
  const [showNewSegment, setShowNewSegment] = useState(false);

  const totalCustomers = segments.reduce((sum, segment) => sum + segment.customerCount, 0);
  const totalRevenue = segments.reduce((sum, segment) => sum + segment.totalRevenue, 0);

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
            <h1 className="text-3xl font-bold text-gray-900">Customer Segments</h1>
            <p className="text-gray-600 mt-1">Manage and analyze customer segments for targeted marketing</p>
          </div>
        </div>
        <button 
          onClick={() => setShowNewSegment(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Segment</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <span className="text-blue-600 text-sm font-medium">{segments.length} segments</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalCustomers.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Total Customers</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <span className="text-green-600 text-sm font-medium">+12% growth</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{(totalRevenue / 100000).toFixed(1)}L</h3>
          <p className="text-gray-600 text-sm">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-purple-600" />
            <span className="text-purple-600 text-sm font-medium">Most valuable</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">VIP</h3>
          <p className="text-gray-600 text-sm">Top Segment</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <ShoppingBag className="h-8 w-8 text-orange-600" />
            <span className="text-orange-600 text-sm font-medium">Avg per customer</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{Math.round(totalRevenue / totalCustomers).toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Revenue per Customer</p>
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {segments.map((segment) => (
          <div key={segment.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${
              segment.color === 'purple' ? 'from-purple-500 to-purple-600' :
              segment.color === 'blue' ? 'from-blue-500 to-blue-600' :
              segment.color === 'green' ? 'from-green-500 to-green-600' :
              'from-red-500 to-red-600'
            }`}></div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{segment.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-600 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{segment.customerCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">₹{segment.averageOrderValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Avg Order</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">₹{(segment.totalRevenue / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-gray-900 text-sm">Segment Criteria:</h4>
                {segment.criteria.map((criteria, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
                      {criteria.field}
                    </span>
                    <span className="text-gray-500">{criteria.operator}</span>
                    <span className="px-2 py-1 bg-blue-100 rounded text-blue-700 font-medium">
                      {criteria.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Updated: {segment.lastUpdated}
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/crm/segments/${segment.id}`}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </Link>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <Target className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Targeted Campaigns</h3>
          <p className="text-blue-100 mb-4">Create email campaigns for specific segments</p>
          <Link 
            href="/admin/crm/communications" 
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors inline-block"
          >
            Create Campaign
          </Link>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <Users className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Segment Analysis</h3>
          <p className="text-green-100 mb-4">Deep dive into customer behavior patterns</p>
          <Link 
            href="/admin/crm/analytics" 
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors inline-block"
          >
            View Analytics
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <TrendingUp className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Performance Tracking</h3>
          <p className="text-purple-100 mb-4">Monitor segment performance over time</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
            View Reports
          </button>
        </div>
      </div>

      {/* New Segment Modal (placeholder) */}
      {showNewSegment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Segment</h3>
            <p className="text-gray-600 mb-4">Feature coming soon! You&apos;ll be able to create custom customer segments with advanced criteria.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewSegment(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
