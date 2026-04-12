export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  stock: number
  category: string | null
  // Camera-specific technical specifications
  resolution?: string
  night_vision?: boolean
  weather_resistance?: string
  field_of_view?: string
  storage_capacity?: string
  connectivity?: string[]
  sensor_type?: string
  lens_focal_length?: string
  power_consumption?: string
  operating_temperature?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Customer {
  name: string
  email: string
  phone: string | null
  address: string
}

export interface OrderRequest {
  customer: Customer
  items: {
    product_id: string
    product_name: string
    product_price: number
    quantity: number
  }[]
  total: number
}

export interface OrderResponse {
  orderId: string
  success: boolean
  message?: string
}

// Camera Store Specific Types
export interface CameraFilter {
  categories: string[]
  resolutionRange: [number, number]
  features: string[]
  priceRange: [number, number]
  nightVision: boolean
  weatherResistance: string[]
}

export interface ProductComparison {
  products: Product[]
  selectedSpecs: string[]
}

export interface QuoteRequest {
  customer: Customer
  products: {
    product_id: string
    quantity: number
    notes?: string
  }[]
  project_type: 'residential' | 'commercial' | 'industrial'
  installation_required: boolean
}
