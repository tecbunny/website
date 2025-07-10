"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Mail, 
  Send, 
  MessageSquare,
  Bell,
  Target,
  Eye,
  BarChart3,
  Plus,
  Filter
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Holiday Sale 2024",
    type: "Email",
    status: "Active",
    sent: 2847,
    opened: 1423,
    clicked: 456,
    converted: 89,
    revenue: 156800,
    createdDate: "2024-12-01",
    segment: "All Customers"
  },
  {
    id: 2,
    name: "VIP Customer Exclusive",
    type: "Email",
    status: "Completed",
    sent: 285,
    opened: 198,
    clicked: 87,
    converted: 34,
    revenue: 89400,
    createdDate: "2024-11-15",
    segment: "VIP"
  },
  {
    id: 3,
    name: "Cart Abandonment Reminder",
    type: "Automated",
    status: "Active",
    sent: 456,
    opened: 234,
    clicked: 123,
    converted: 45,
    revenue: 32100,
    createdDate: "2024-11-01",
    segment: "Cart Abandoners"
  }
];

const templates = [
  {
    id: 1,
    name: "Welcome Series",
    type: "Welcome",
    description: "3-part welcome sequence for new customers",
    lastUsed: "2024-12-10"
  },
  {
    id: 2,
    name: "Product Launch",
    type: "Promotion",
    description: "Announce new products to customers",
    lastUsed: "2024-11-28"
  },
  {
    id: 3,
    name: "Win-back Campaign",
    type: "Re-engagement",
    description: "Re-engage inactive customers",
    lastUsed: "2024-11-15"
  }
];

export default function CRMCommunications() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  const tabs = [
    { id: "campaigns", label: "Campaigns", icon: Mail },
    { id: "templates", label: "Templates", icon: MessageSquare },
    { id: "automation", label: "Automation", icon: Bell },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
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
            <h1 className="text-3xl font-bold text-gray-900">Customer Communications</h1>
            <p className="text-gray-600 mt-1">Manage email campaigns and customer messaging</p>
          </div>
        </div>
        <button 
          onClick={() => setShowNewCampaign(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
            <span className="text-green-600 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">3,588</h3>
          <p className="text-gray-600 text-sm">Total Emails Sent</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <Eye className="h-8 w-8 text-green-600" />
            <span className="text-green-600 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">1,855</h3>
          <p className="text-gray-600 text-sm">Emails Opened</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-purple-600" />
            <span className="text-green-600 text-sm font-medium">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">666</h3>
          <p className="text-gray-600 text-sm">Click-through</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <span className="text-green-600 text-sm font-medium">+22%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹2.78L</h3>
          <p className="text-gray-600 text-sm">Revenue Generated</p>
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
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "campaigns" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Campaign</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Sent</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Open Rate</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Click Rate</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {campaigns.map((campaign) => {
                      const openRate = ((campaign.opened / campaign.sent) * 100).toFixed(1);
                      const clickRate = ((campaign.clicked / campaign.sent) * 100).toFixed(1);
                      
                      return (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-semibold text-gray-900">{campaign.name}</div>
                              <div className="text-sm text-gray-500">{campaign.segment}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {campaign.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              campaign.status === 'Active' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            {campaign.sent.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${openRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{openRate}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${clickRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{clickRate}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            ₹{(campaign.revenue / 1000).toFixed(0)}K
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-green-600 transition-colors">
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "templates" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Template</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {template.type}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Last used: {template.lastUsed}</span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Use
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "automation" && (
            <div className="text-center py-16">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Email Automation</h3>
              <p className="text-gray-500 mb-6">Set up automated email sequences for better customer engagement</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Create Automation
              </button>
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Communication Analytics</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Performance Overview</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Open Rate</span>
                      <span className="font-semibold text-gray-900">52.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Click Rate</span>
                      <span className="font-semibold text-gray-900">18.6%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-gray-900">4.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Unsubscribe Rate</span>
                      <span className="font-semibold text-gray-900">0.8%</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Best Performing</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-600">Subject Line</span>
                      <p className="font-medium text-gray-900">&quot;🎄 Limited Time Holiday Sale - 50% Off!&quot;</p>
                      <span className="text-sm text-green-600">68.2% open rate</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Send Time</span>
                      <p className="font-medium text-gray-900">Tuesday, 10:00 AM</p>
                      <span className="text-sm text-blue-600">Best engagement</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Segment</span>
                      <p className="font-medium text-gray-900">VIP Customers</p>
                      <span className="text-sm text-purple-600">35% higher conversion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Campaign Modal Placeholder */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Campaign</h3>
            <p className="text-gray-600 mb-4">Campaign creation feature coming soon!</p>
            <button 
              onClick={() => setShowNewCampaign(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
