/**
 * Resolución server-side de URLs remotas del storefront (proxy hacia el
 * dashboard). Módulo EXCLUSIVAMENTE server-side: resuelve siempre URL
 * absoluta (clientFallback: false) y lanza si falta config. Lo protege
 * `import "server-only"` + el lint de CI `lint:boundary`
 * (scripts/lint-client-boundary.js); no debe importarse desde componentes.
 */
import "server-only"

import { buildStoreApiUrl } from "./store-api-root"
import type { ResolveStoreApiRootOptions } from "./store-api-root"

/**
 * Opciones para la resolución server-side de la URL del storefront:
 * siempre URL absoluta (sin fallback de cliente) y error si falta config.
 * Todas las URLs remotas del proxy delegan en buildStoreApiUrl, el único
 * punto de construcción de URLs del storefront.
 */
const REMOTE_STORE_OPTIONS: ResolveStoreApiRootOptions = {
  clientFallback: false,
  throwIfMissing: true,
}

export function getRemoteStoreOrdersUrl(orderId?: string) {
  const path = orderId ? `/orders/${encodeURIComponent(orderId)}` : "/orders"
  return buildStoreApiUrl(path, REMOTE_STORE_OPTIONS)
}

export function getRemoteStoreQuoteRequestsUrl() {
  return buildStoreApiUrl("/quote-requests", REMOTE_STORE_OPTIONS)
}

export function getRemoteStoreProductsUrl(search?: string) {
  return buildStoreApiUrl("/products", REMOTE_STORE_OPTIONS, search)
}

export function getRemoteStoreProductDetailUrl(productId: string) {
  return buildStoreApiUrl(`/products/${encodeURIComponent(productId)}`, REMOTE_STORE_OPTIONS)
}

export function getRemoteStoreOnSaleProductsUrl() {
  return buildStoreApiUrl("/products/on-sale", REMOTE_STORE_OPTIONS)
}

export function getRemoteStoreCategoriesUrl() {
  return buildStoreApiUrl("/categories", REMOTE_STORE_OPTIONS)
}

export function getRemoteStoreBrandsUrl() {
  return buildStoreApiUrl("/brands", REMOTE_STORE_OPTIONS)
}

export function getRemoteStoreSlidesUrl() {
  return buildStoreApiUrl("/slides", REMOTE_STORE_OPTIONS)
}

export function getRemoteStoreAdsUrl() {
  return buildStoreApiUrl("/ads", REMOTE_STORE_OPTIONS)
}

export function getRemoteStoreSettingsUrl() {
  return buildStoreApiUrl("/settings", REMOTE_STORE_OPTIONS)
}
