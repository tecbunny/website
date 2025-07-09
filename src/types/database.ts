export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'customer' | 'vendor' | 'admin'
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          role?: 'customer' | 'vendor' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: 'customer' | 'vendor' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          user_id: string
          business_name: string
          gstin: string | null
          is_approved: boolean
          commission_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          gstin?: string | null
          is_approved?: boolean
          commission_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          gstin?: string | null
          is_approved?: boolean
          commission_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string
          category_id: string
          name: string
          description: string | null
          price: number
          discount_price: number | null
          stock_quantity: number
          images: string[]
          specifications: Record<string, unknown> | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          category_id: string
          name: string
          description?: string | null
          price: number
          discount_price?: number | null
          stock_quantity: number
          images: string[]
          specifications?: Record<string, unknown> | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          discount_price?: number | null
          stock_quantity?: number
          images?: string[]
          specifications?: Record<string, unknown> | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string
          payment_id: string | null
          shipping_address: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string
          payment_id?: string | null
          shipping_address: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount?: number
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string
          payment_id?: string | null
          shipping_address?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          type: 'home' | 'office' | 'other'
          name: string
          phone: string
          address_line_1: string
          address_line_2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'home' | 'office' | 'other'
          name: string
          phone: string
          address_line_1: string
          address_line_2?: string | null
          city: string
          state: string
          postal_code: string
          country: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'home' | 'office' | 'other'
          name?: string
          phone?: string
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          category: 'computer' | 'cctv' | 'network' | 'mobile'
          price: number
          estimated_time: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: 'computer' | 'cctv' | 'network' | 'mobile'
          price: number
          estimated_time?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: 'computer' | 'cctv' | 'network' | 'mobile'
          price?: number
          estimated_time?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          customer_id: string
          service_id: string
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
          description: string | null
          scheduled_date: string | null
          address: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          service_id: string
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
          description?: string | null
          scheduled_date?: string | null
          address: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          service_id?: string
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
          description?: string | null
          scheduled_date?: string | null
          address?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
