export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  stock: number
  category: string | null
  created_at: string
  updated_at: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Customer {
  id?: string
  name: string
  email: string
  phone: string | null
  address: string
}

export interface Order {
  id: string
  customer_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  customer_address: string
  total: number
  status: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
  created_at: string
}
