"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  TrendingUp, 
  TrendingDown,
  Users, 
  ShoppingBag, 
  IndianRupee,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";

const analyticsData = {
  overview: {
    totalCustomers: 2847,
    activeCustomers: 1923,
    newCustomers: 156,
    churnRate: 3.2,
    avgOrderValue: 1850,
    customerLifetimeValue: 15600,
    repeatCustomerRate: 68.5,
    customerSatisfaction: 4.7
  },
  chartData: {
    customerGrowth: [
      { month: 'Jan', customers: 2156 },
      { month: 'Feb', customers: 2289 },
      { month: 'Mar', customers: 2401 },
      { month: 'Apr', customers: 2534 },
      { month: 'May', customers: 2645 },
      { month: 'Jun', customers: 2847 }
    ],
    segmentDistribution: [
      { segment: 'VIP', count: 285, percentage: 10 },
      { segment: 'Regular', count: 1708, percentage: 60 },
      { segment: 'New', count: 854, percentage: 30 }
    ],
    ordersByCategory: [
      { category: 'Computer Accessories', orders: 3420, revenue: 6840000 },
      { category: 'Mobile Accessories', orders: 2890, revenue: 4335000 },
      { category: 'Networking Devices', orders: 1560, revenue: 7800000 },
      { category: 'Personal Goods', orders: 980, revenue: 1960000 }
    ]
  }
};

export default function CRMAnalytics() {
  const [dateRange, setDateRange] = useState("6months");
  const { overview, chartData } = analyticsData;

  const metrics = [
    {
      title: "Total Customers",
      value: overview.totalCustomers.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Active Customers",
      value: overview.activeCustomers.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "New Customers",
      value: overview.newCustomers.toString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "purple"
    },
    {
      title: "Churn Rate",
      value: `${overview.churnRate}%`,
      change: "-0.8%",
      trend: "down",
      icon: TrendingDown,
      color: "red"
    },
    {
      title: "Avg Order Value",
      value: `₹${overview.avgOrderValue.toLocaleString()}`,
      change: "+5.7%",
      trend: "up",
      icon: IndianRupee,
      color: "green"
    },
    {
      title: "Customer LTV",
      value: `₹${overview.customerLifetimeValue.toLocaleString()}`,
      change: "+18.4%",
      trend: "up",
      icon: TrendingUp,
      color: "blue"
    },
    {
      title: "Repeat Rate",
      value: `${overview.repeatCustomerRate}%`,
      change: "+3.2%",
      trend: "up",
      icon: BarChart3,
      color: "purple"
    },
    {
      title: "Satisfaction",
      value: `${overview.customerSatisfaction}/5`,
      change: "+0.3",
      trend: "up",
      icon: TrendingUp,
      color: "green"
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Customer Analytics</h1>
            <p className="text-gray-600 mt-1">Insights and metrics about your customers</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <metric.icon className={`h-8 w-8 text-${metric.color}-600`} />
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                metric.trend === 'up' 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-gray-600 text-sm">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Customer Growth Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Growth</h3>
            <LineChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {chartData.customerGrowth.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(data.customers / 3000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900 min-w-[60px] text-right">
                    {data.customers.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {chartData.segmentDistribution.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    segment.segment === 'VIP' ? 'bg-purple-500' :
                    segment.segment === 'Regular' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-gray-700">{segment.segment}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">{segment.percentage}%</span>
                  <span className="font-semibold text-gray-900 min-w-[60px] text-right">
                    {segment.count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Orders</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Order Value</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chartData.ordersByCategory.map((category, index) => {
                const avgOrderValue = category.revenue / category.orders;
                const performance = (category.revenue / 8000000) * 100;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{category.category}</td>
                    <td className="py-3 px-4 text-gray-700">{category.orders.toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      ₹{(category.revenue / 100000).toFixed(1)}L
                    </td>
                    <td className="py-3 px-4 text-gray-700">₹{Math.round(avgOrderValue).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{performance.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <TrendingUp className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Top Performing Segment</h3>
          <p className="text-blue-100 mb-4">VIP customers generate 35% of total revenue</p>
          <Link 
            href="/admin/crm/segments" 
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors inline-block"
          >
            View Segments
          </Link>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <Users className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Customer Retention</h3>
          <p className="text-green-100 mb-4">68.5% of customers made repeat purchases</p>
          <Link 
            href="/admin/crm/retention" 
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors inline-block"
          >
            View Details
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <ShoppingBag className="h-8 w-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Growth Opportunity</h3>
          <p className="text-purple-100 mb-4">Focus on mobile accessories for 25% growth</p>
          <Link 
            href="/admin/crm/opportunities" 
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors inline-block"
          >
            View Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
