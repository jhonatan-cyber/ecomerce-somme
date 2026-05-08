function resolveStoreApiRoot() {
  if (typeof window !== "undefined") {
    return "/api/store"
  }

  const explicitStoreRoot = process.env.NEXT_PUBLIC_STORE_API_URL?.trim()
  if (explicitStoreRoot) {
    return explicitStoreRoot.replace(/\/$/, "")
  }

  const apiRoot = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (apiRoot) {
    const normalizedApiRoot = apiRoot.replace(/\/$/, "")

    if (normalizedApiRoot.endsWith("/store")) {
      return normalizedApiRoot
    }

    return `${normalizedApiRoot}/store`
  }

  return "/api/store"
}

export function getStoreOrdersUrl(orderId?: string) {
  const root = resolveStoreApiRoot()
  const baseUrl = `${root}/orders`

  if (!orderId) {
    return baseUrl
  }

  return `${baseUrl}/${encodeURIComponent(orderId)}`
}
