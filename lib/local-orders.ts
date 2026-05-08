import type { OrderRequest, OrderResponse } from "./types"
import { getStoreOrdersUrl } from "./store-order-endpoint"

// Almacenamiento local para pedidos cuando el backend no está disponible
export interface LocalOrder extends OrderRequest {
  id: string
  createdAt: string
  status: 'pending' | 'synced' | 'error'
  syncAttempts: number
  lastSyncAttempt?: string
  syncedAt?: string
  remoteOrderId?: string
}

export const LOCAL_STORAGE_KEY = 'somme_local_orders'
const LEGACY_STORAGE_KEY = 'somme_orders'

function readOrdersFromStorage(key: string): LocalOrder[] {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistOrders(orders: LocalOrder[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders))
  localStorage.removeItem(LEGACY_STORAGE_KEY)
}

export class LocalOrderManager {
  // Guardar pedido localmente
  static saveOrder(orderData: OrderRequest): OrderResponse {
    const orderId = this.generateOrderId()
    const localOrder: LocalOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      syncAttempts: 0
    }

    try {
      const existingOrders = this.getStoredOrders()
      existingOrders.push(localOrder)
      persistOrders(existingOrders)
      
      console.log('✅ Pedido guardado localmente:', orderId)
      
      return {
        orderId,
        success: true,
        message: 'Pedido guardado localmente. Se sincronizará cuando el backend esté disponible.'
      }
    } catch (error) {
      console.error('❌ Error guardando pedido localmente:', error)
      return {
        orderId: '',
        success: false,
        message: 'Error al guardar el pedido localmente'
      }
    }
  }

  // Obtener todos los pedidos guardados localmente
  static getStoredOrders(): LocalOrder[] {
    try {
      const migratedOrders = [
        ...readOrdersFromStorage(LOCAL_STORAGE_KEY),
        ...readOrdersFromStorage(LEGACY_STORAGE_KEY),
      ]

      const uniqueOrders = new Map<string, LocalOrder>()
      for (const order of migratedOrders) {
        if (!order || typeof order !== "object" || typeof order.id !== "string") {
          continue
        }

        uniqueOrders.set(order.id, {
          ...order,
          syncAttempts: typeof order.syncAttempts === "number" ? order.syncAttempts : 0,
          status: order.status ?? "pending",
        })
      }

      const orders = Array.from(uniqueOrders.values())
      persistOrders(orders)
      return orders
    } catch (error) {
      console.error('❌ Error obteniendo pedidos locales:', error)
      return []
    }
  }

  // Sincronizar pedidos pendientes con el backend
  static async syncPendingOrders(): Promise<void> {
    const orders = this.getStoredOrders()
    const pendingOrders = orders.filter(order => order.status === 'pending')

    if (pendingOrders.length === 0) {
      console.log('📋 No hay pedidos pendientes para sincronizar')
      return
    }

    console.log(`🔄 Sincronizando ${pendingOrders.length} pedidos pendientes...`)

    for (const order of pendingOrders) {
      await this.syncOrder(order)
    }
  }

  // Sincronizar un pedido individual
  private static async syncOrder(order: LocalOrder): Promise<void> {
    try {
      const response = await fetch(getStoreOrdersUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          customer: order.customer,
          items: order.items,
          total: order.total,
          tax: order.tax,
          deliveryMethod: order.deliveryMethod,
          paymentMethod: order.paymentMethod,
          notes: order.notes
            ? `${order.notes} (Sincronizado desde almacenamiento local)`
            : 'Sincronizado desde almacenamiento local'
        })
      })

      if (response.ok) {
        const result = await response.json()
        const remoteOrderId =
          typeof result?.orderId === "string" ? result.orderId
            : typeof result?.id === "string" ? result.id
              : null

        if (result.success || remoteOrderId) {
          this.markOrderAsSynced(order.id, remoteOrderId)
          console.log(`✅ Pedido ${order.id} sincronizado exitosamente`)
        } else {
          throw new Error(result.message || 'Error en respuesta del servidor')
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error(`❌ Error sincronizando pedido ${order.id}:`, error)
      this.updateOrderStatus(order.id, 'error')
      this.incrementSyncAttempts(order.id)
    }
  }

  // Actualizar estado de un pedido
  private static updateOrderStatus(orderId: string, status: 'pending' | 'synced' | 'error'): void {
    const orders = this.getStoredOrders()
    const orderIndex = orders.findIndex(order => order.id === orderId)
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status
      orders[orderIndex].lastSyncAttempt = new Date().toISOString()
      persistOrders(orders)
    }
  }

  private static markOrderAsSynced(orderId: string, remoteOrderId: string | null): void {
    const orders = this.getStoredOrders()
    const orderIndex = orders.findIndex(order => order.id === orderId)

    if (orderIndex !== -1) {
      const now = new Date().toISOString()
      orders[orderIndex].status = 'synced'
      orders[orderIndex].lastSyncAttempt = now
      orders[orderIndex].syncedAt = now
      orders[orderIndex].remoteOrderId = remoteOrderId ?? orders[orderIndex].remoteOrderId
      persistOrders(orders)
    }
  }

  // Incrementar intentos de sincronización
  private static incrementSyncAttempts(orderId: string): void {
    const orders = this.getStoredOrders()
    const orderIndex = orders.findIndex(order => order.id === orderId)
    
    if (orderIndex !== -1) {
      orders[orderIndex].syncAttempts++
      orders[orderIndex].lastSyncAttempt = new Date().toISOString()
      persistOrders(orders)
    }
  }

  // Generar ID de pedido único
  private static generateOrderId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `ORD-${timestamp}-${random}`.toUpperCase()
  }

  // Limpiar pedidos antiguos (más de 30 días)
  static cleanupOldOrders(): void {
    const orders = this.getStoredOrders()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate > thirtyDaysAgo || order.status === 'pending'
    })

    if (filteredOrders.length !== orders.length) {
      persistOrders(filteredOrders)
      console.log(`🧹 Limpieza completada: ${orders.length - filteredOrders.length} pedidos antiguos eliminados`)
    }
  }

  // Obtener estadísticas de pedidos locales
  static getOrderStats() {
    const orders = this.getStoredOrders()
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      synced: orders.filter(o => o.status === 'synced').length,
      error: orders.filter(o => o.status === 'error').length,
      lastSync: orders
        .filter(o => o.lastSyncAttempt)
        .sort((a, b) => new Date(b.lastSyncAttempt!).getTime() - new Date(a.lastSyncAttempt!).getTime())[0]?.lastSyncAttempt || null
    }
  }
}
