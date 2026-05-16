function resolveRemoteStoreApiRoot() {
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

  throw new Error("No se configuró NEXT_PUBLIC_STORE_API_URL o NEXT_PUBLIC_API_URL para el proxy del storefront.")
}

function buildRemoteStoreUrl(path: string, search?: string) {
  const root = resolveRemoteStoreApiRoot()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const baseUrl = `${root}${normalizedPath}`

  if (!search) {
    return baseUrl
  }

  const normalizedSearch = search.startsWith("?") ? search : `?${search}`
  return `${baseUrl}${normalizedSearch}`
}

export function getRemoteStoreOrdersUrl(orderId?: string) {
  const path = orderId ? `/orders/${encodeURIComponent(orderId)}` : "/orders"
  return buildRemoteStoreUrl(path)
}

export function getRemoteStoreQuoteRequestsUrl() {
  return buildRemoteStoreUrl("/quote-requests")
}

export function getRemoteStoreProductsUrl(search?: string) {
  return buildRemoteStoreUrl("/products", search)
}

export function getRemoteStoreProductDetailUrl(productId: string) {
  return buildRemoteStoreUrl(`/products/${encodeURIComponent(productId)}`)
}

export function getRemoteStoreOnSaleProductsUrl() {
  return buildRemoteStoreUrl("/products/on-sale")
}

export function getRemoteStoreCategoriesUrl() {
  return buildRemoteStoreUrl("/categories")
}

export function getRemoteStoreBrandsUrl() {
  return buildRemoteStoreUrl("/brands")
}

export function getRemoteStoreBranchesUrl() {
  return buildRemoteStoreUrl("/branches")
}

export function getRemoteStoreDepositsUrl() {
  return buildRemoteStoreUrl("/deposits")
}

export function getRemoteStoreWarehousesUrl() {
  return buildRemoteStoreUrl("/warehouses")
}

export function getRemoteStoreSlidesUrl() {
  return buildRemoteStoreUrl("/slides")
}

export function getRemoteStoreAdsUrl() {
  return buildRemoteStoreUrl("/ads")
}
