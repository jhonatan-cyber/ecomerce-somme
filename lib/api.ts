import type { Product, OrderRequest, OrderResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function createOrder(orderData: OrderRequest): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating order:', error)
    return {
      orderId: '',
      success: false,
      message: 'Error al procesar el pedido'
    }
  }
}
