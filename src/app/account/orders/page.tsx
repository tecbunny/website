'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react'

// Mock order data
const orders = [
  {
    id: 'TB12345',
    date: '2024-12-15',
    status: 'delivered',
    total: 2499,
    items: [
      { name: 'MacBook Pro Charger', quantity: 1, price: 2499 }
    ]
  },
  {
    id: 'TB12344',
    date: '2024-12-10',
    status: 'shipped',
    total: 1299,
    items: [
      { name: 'Wireless Gaming Mouse', quantity: 1, price: 1299 }
    ]
  },
  {
    id: 'TB12343',
    date: '2024-12-05',
    status: 'processing',
    total: 5999,
    items: [
      { name: 'USB-C Hub', quantity: 2, price: 2999 },
      { name: 'Phone Case', quantity: 1, price: 999 }
    ]
  },
  {
    id: 'TB12342',
    date: '2024-11-28',
    status: 'delivered',
    total: 15999,
    items: [
      { name: 'Gaming Headset', quantity: 1, price: 7999 },
      { name: 'Mechanical Keyboard', quantity: 1, price: 7999 }
    ]
  }
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'delivered':
      return { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        text: 'Delivered' 
      }
    case 'shipped':
      return { 
        color: 'bg-blue-100 text-blue-800', 
        icon: Truck, 
        text: 'Shipped' 
      }
    case 'processing':
      return { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock, 
        text: 'Processing' 
      }
    default:
      return { 
        color: 'bg-gray-100 text-gray-800', 
        icon: Package, 
        text: 'Unknown' 
      }
  }
}

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
              <p className="text-sm text-gray-600">Delivered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'shipped').length}
              </p>
              <p className="text-sm text-gray-600">Shipped</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'processing').length}
              </p>
              <p className="text-sm text-gray-600">Processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const StatusIcon = statusInfo.icon

            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {statusInfo.text}
                      </div>
                      <p className="text-lg font-bold text-gray-900 mt-1">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <Button className="text-sm px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button className="text-sm px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                          Write Review
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button className="text-sm px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200">
                          Cancel Order
                        </Button>
                      )}
                    </div>
                    
                    {order.status === 'shipped' && (
                      <Button className="text-sm px-3 py-1">
                        Track Package
                      </Button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <Button className="text-sm px-3 py-1">
                        Reorder Items
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet. Start shopping to see your orders here!</p>
              <Link href="/products">
                <Button>
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
