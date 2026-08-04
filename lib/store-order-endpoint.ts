import { buildStoreApiUrl } from "./store-api-root"

export function getStoreOrdersUrl(orderId?: string) {
  const baseUrl = buildStoreApiUrl("/orders")

  if (!orderId) {
    return baseUrl
  }

  return `${baseUrl}/${encodeURIComponent(orderId)}`
}
