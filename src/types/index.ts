import { Database } from './database'

export type User = Database['public']['Tables']['users']['Row']
export type Vendor = Database['public']['Tables']['vendors']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Address = Database['public']['Tables']['addresses']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type ServiceRequest = Database['public']['Tables']['service_requests']['Row']

export type UserRole = 'customer' | 'vendor' | 'admin'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type ServiceCategory = 'computer' | 'cctv' | 'network' | 'mobile'
export type ServiceRequestStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface CheckoutData {
  items: CartItem[]
  shipping_address: Address
  payment_method: string
  total_amount: number
}

export interface PhonePePaymentRequest {
  merchantId: string
  merchantTransactionId: string
  amount: number
  callbackUrl: string
  merchantUserId: string
  paymentInstrument: {
    type: 'PAY_PAGE'
  }
}

export interface PhonePePaymentResponse {
  success: boolean
  code: string
  message: string
  data?: {
    merchantId: string
    merchantTransactionId: string
    transactionId: string
    amount: number
    state: string
    responseCode: string
    paymentInstrument: {
      type: string
      utr?: string
      cardType?: string
      pgTransactionId?: string
      pgAuthorizationCode?: string
      arn?: string
      bankTransactionId?: string
      bankId?: string
    }
  }
}

export interface DashboardStats {
  totalUsers: number
  totalVendors: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: Order[]
  topProducts: Product[]
}

export interface VendorStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  recentOrders: Order[]
  topProducts: Product[]
}

export interface SearchFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'created_desc'
}

export interface NotificationData {
  id: string
  type: 'order' | 'payment' | 'service' | 'system'
  title: string
  message: string
  read: boolean
  created_at: string
  data?: Record<string, unknown>
}
