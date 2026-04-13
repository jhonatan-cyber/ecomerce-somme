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

export interface Category {
  id: string
  name: string
  icon: string | null
  description: string | null
  active: boolean
}

export interface CatalogLoadResult {
  ok: boolean
  products: Product[]
  error: string | null
  sourceUrl: string
  status?: number
}

export interface ProductDetailLoadResult {
  ok: boolean
  product: Product | null
  error: string | null
  sourceUrl: string
  status?: number
}

export interface CategoryLoadResult {
  ok: boolean
  categories: Category[]
  error: string | null
  sourceUrl: string
  status?: number
}

export interface StoreOrderCustomer {
  name: string | null
  email: string | null
  phone: string | null
  address: string | null
}

export interface StoreOrderItem {
  productId: string
  productName: string
  productPrice: number
  quantity: number
}

export interface StoreOrder {
  id: string
  orderId: string
  customer: StoreOrderCustomer | null
  items: StoreOrderItem[]
  total: number | null
  status: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface OrderLookupResult {
  ok: boolean
  order: StoreOrder | null
  error: string | null
  sourceUrl: string
  status?: number
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
