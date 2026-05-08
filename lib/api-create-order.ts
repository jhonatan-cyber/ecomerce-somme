import type { OrderRequest, OrderResponse } from "./types"
import { LocalOrderManager } from "./local-orders"
import { getStoreOrdersUrl } from "./store-order-endpoint"

const ORDER_REQUEST_TIMEOUT_MS = 20000

function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof DOMException && error.name === "TimeoutError"
  ) || (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.message.toLowerCase().includes("timed out"))
  )
}

// Crea pedidos en el endpoint real del dashboard y usa fallback local solo
// cuando hay problemas de conectividad o errores 5xx.
export async function createOrder(orderData: OrderRequest): Promise<OrderResponse> {
  const sourceUrl = getStoreOrdersUrl()
  const controller = new AbortController()
  const timeoutId = window.setTimeout(
    () => controller.abort(new DOMException("signal timed out", "TimeoutError")),
    ORDER_REQUEST_TIMEOUT_MS,
  )

  try {
    const response = await fetch(sourceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(orderData),
      signal: controller.signal,
    })

    const result = await response.json().catch(() => null)

    if (response.ok) {
      const orderId = result?.id || result?.orderId || result?.order_id

      if (!orderId) {
        return {
          orderId: "",
          success: false,
          message: "El backend no devolvio el identificador del pedido.",
        }
      }

      return {
        orderId,
        success: true,
        message: "Pedido creado exitosamente",
      }
    }

    const backendMessage =
      typeof result?.error === "string" && result.error.trim().length > 0
        ? result.error
        : typeof result?.message === "string" && result.message.trim().length > 0
          ? result.message
          : `Error del servidor (${response.status})`

    if (response.status >= 500) {
      return LocalOrderManager.saveOrder(orderData)
    }

    return {
      orderId: "",
      success: false,
      message: backendMessage,
    }
  } catch (error) {
    if (isTimeoutError(error)) {
      return LocalOrderManager.saveOrder(orderData)
    }

    return LocalOrderManager.saveOrder(orderData)
  } finally {
    window.clearTimeout(timeoutId)
  }
}
