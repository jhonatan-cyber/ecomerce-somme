import type { OrderRequest, OrderResponse } from "./types"
import { LocalOrderManager } from "./local-orders"

// Sistema simple de pedidos locales - fallback inmediato
export function createSimpleOrder(orderData: OrderRequest): OrderResponse {
  return LocalOrderManager.saveOrder(orderData)
}

// Obtener pedidos guardados
export function getLocalOrders() {
  return LocalOrderManager.getStoredOrders()
}

// Sincronizar pedidos con backend (función simple)
export async function syncOrders() {
  await LocalOrderManager.syncPendingOrders()
}
