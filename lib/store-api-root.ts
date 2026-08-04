/**
 * Módulo ISOMÓRFICO del storefront: resolución de la URL raíz, construcción
 * de URLs y transporte de fetch compartido entre cliente y servidor.
 *
 * ── FRONTERA CLIENTE/SERVIDOR ────────────────────────────────────────────
 * Este módulo vive en AMBOS lados del bundle: lo importan componentes con
 * "use client" (footer, promo-banner, product-branch-stock-table, checkout,
 * lib/api.ts) y también rutas proxy server-side. Por eso NO puede importar
 * nada de `next/server` (NextResponse, headers, etc.) — eso filtraría código
 * server-only al bundle del navegador.
 *
 * Qué puede importar: solo APIs isomórficas (fetch, Headers, process.env,
 * Object.fromEntries). Qué NO debe importar: next/server, next/headers, ni
 * módulos server-only como lib/server-store-proxy.ts.
 *
 * La contraparte server-only es lib/server-store-proxy.ts (moldes
 * NextResponse: buildForwardedResponse/buildProxyError): la división existe
 * justamente por la frontera next/server y la refuerzan `server-only` + el
 * lint de CI `lint:boundary` (scripts/lint-client-boundary.js).
 *
 * Antes esta lógica estaba duplicada en api.ts, server-store-api.ts y
 * store-order-endpoint.ts. Este módulo unifica la resolución de la raíz y
 * la construcción de URLs para evitar inconsistencias entre entornos
 * (cliente vs servidor) y mantener un único punto de configuración.
 */

export interface ResolveStoreApiRootOptions {
  /**
   * Cuando es true (por defecto), en contextos de navegador
   * (typeof window !== "undefined") se respeta NEXT_PUBLIC_STORE_API_URL si
   * está configurada — permite clientes que apuntan directamente a un API
   * remoto sin el proxy /api/store. Si no está configurada, se devuelve
   * "/api/store" para pasar por el proxy del mismo Next.js.
   *
   * Nota: configurar NEXT_PUBLIC_STORE_API_URL en el navegador hace que las
   * llamadas del cliente (p. ej. createOrder/createQuoteRequest) salten las
   * rutas proxy /api/store/* por completo, perdiendo su rate-limit y
   * validación server-side. En el navegador solo esa variable activa el modo
   * directo; NEXT_PUBLIC_API_URL (sin /store) mantiene el proxy por defecto.
   */
  clientFallback?: boolean
  /**
   * Cuando es true, lanza un error si no hay variable de entorno
   * configurada. Pensado para el proxy server-side que necesita una URL
   * absoluta (server-store-api.ts).
   */
  throwIfMissing?: boolean
}

/**
 * Resuelve la raíz del storefront desde la configuración (server-side):
 * NEXT_PUBLIC_STORE_API_URL si existe, o NEXT_PUBLIC_API_URL + "/store"
 * (evitando duplicar el segmento si ya termina en /store). Devuelve null
 * cuando no hay ninguna variable configurada.
 */
function resolveConfiguredStoreRoot(): string | null {
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

  return null
}

export function resolveStoreApiRoot(options: ResolveStoreApiRootOptions = {}): string {
  const { clientFallback = true, throwIfMissing = false } = options

  // NEXT_PUBLIC_* son públicas por diseño (Next.js las inlinea en el bundle
  // del cliente), así que no hay razón para ocultarlas del navegador: si la
  // raíz del storefront está configurada explícitamente, respetarla también
  // en el cliente permite apuntar a un API remoto sin el proxy /api/store.
  //
  // En el navegador solo NEXT_PUBLIC_STORE_API_URL activa el modo directo;
  // NEXT_PUBLIC_API_URL por sí sola mantiene el proxy /api/store (igual que
  // cuando no hay nada configurado).
  const explicitStoreRoot = process.env.NEXT_PUBLIC_STORE_API_URL?.trim()

  if (clientFallback && typeof window !== "undefined") {
    if (explicitStoreRoot) {
      return explicitStoreRoot.replace(/\/$/, "")
    }

    return "/api/store"
  }

  const configured = resolveConfiguredStoreRoot()
  if (configured) {
    return configured
  }

  if (throwIfMissing) {
    throw new Error(
      "No se configuró NEXT_PUBLIC_STORE_API_URL o NEXT_PUBLIC_API_URL para el proxy del storefront."
    )
  }

  return "/api/store"
}

/**
 * Variante server-side para rutas proxy que degradan con elegancia:
 * devuelve null (en vez de lanzar o caer a "/api/store") cuando no hay raíz
 * configurada. Usada por app/api/store/{branches,deposits,warehouses}.
 */
export function resolveStoreApiRootOrNull(): string | null {
  return resolveConfiguredStoreRoot()
}

/**
 * Resuelve la raíz del storefront (con las opciones dadas) y une la ruta
 * en un solo paso. Es el único helper de construcción de URLs de la API
 * pública del storefront: api.ts, server-store-api.ts y
 * store-order-endpoint.ts deben delegar aquí en lugar de reimplementar
 * la resolución + unión localmente.
 */
export function buildStoreApiUrl(
  path: string,
  options: ResolveStoreApiRootOptions = {},
  search?: string
): string {
  return joinStoreApiUrl(resolveStoreApiRoot(options), path, search)
}

/**
 * Fetch de transporte compartido del storefront: inyecta los headers comunes
 * (Accept: application/json + ngrok-skip-browser-warning) y cache no-store,
 * devolviendo la Response cruda para que cada consumidor aplique su propia
 * semántica:
 *
 * - fetchStoreJson: parsea { data } con degradación a null.
 * - proxyStoreGet (lib/server-store-proxy.ts): reenvía status/body al cliente.
 * - Las rutas POST/GET de orders y quote-requests pasan method/body vía init
 *   y reenvían status/body al cliente.
 * - Componentes cliente (footer.tsx, promo-banner.tsx,
 *   product-branch-stock-table.tsx, checkout/page.tsx): fetches en useEffect
 *   que parsean la Response cruda ellos mismos; el transporte les aporta los
 *   headers ngrok/Accept también en modo directo (NEXT_PUBLIC_STORE_API_URL).
 *
 * Antes este bloque (fetch + headers ngrok + no-store) estaba duplicado en
 * las rutas proxy de catálogo, el proxy de forwarding, los proxies de
 * orders/quote-requests y los fetches cliente de componentes.
 */
export async function fetchStoreRemote(url: string, init: RequestInit = {}): Promise<Response> {
  const { method, headers, cache, ...rest } = init

  // RequestInit.headers acepta Headers, string[][] o Record. Normalizamos a
  // un record plano para poder fusionar los headers compartidos sin perder
  // los del llamador.
  const callerHeaders =
    headers instanceof Headers || Array.isArray(headers)
      ? Object.fromEntries(headers)
      : (headers ?? {})

  return fetch(url, {
    ...rest,
    method: method ?? "GET",
    cache: cache ?? "no-store",
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
      ...callerHeaders,
    },
  })
}

/**
 * Fetch GET compartido para las rutas proxy del storefront que degradan con
 * candidatos múltiples (app/api/store/{branches,deposits,warehouses}).
 *
 * Devuelve null cuando la respuesta no es OK o el JSON no es parseable, y
 * tipa el payload como { data?: unknown[] } — la forma que esperan las rutas
 * de listas del catálogo. Antes este bloque estaba duplicado idéntico en
 * las tres rutas.
 */
export async function fetchStoreJson(url: string): Promise<{ data?: unknown[] } | null> {
  const response = await fetchStoreRemote(url)

  if (!response.ok) return null
  return (await response.json().catch(() => null)) as { data?: unknown[] } | null
}

/**
 * Recorre las URLs candidatas (en orden de preferencia) y devuelve la primera
 * lista `data` válida, o null si ninguna responde con un array. Centraliza el
 * loop que antes estaba duplicado en las rutas proxy de listas, dejándolas
 * como simples listas de URLs candidatas.
 */
export async function fetchFirstStoreData(candidates: string[]): Promise<unknown[] | null> {
  for (const url of candidates) {
    const payload = await fetchStoreJson(url)
    if (Array.isArray(payload?.data)) {
      return payload.data
    }
  }

  return null
}

export function joinStoreApiUrl(root: string, path: string, search?: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const normalizedRoot = root.replace(/\/$/, "")

  let baseUrl: string
  if (normalizedRoot.startsWith("http://") || normalizedRoot.startsWith("https://")) {
    baseUrl = new URL(normalizedPath.slice(1), `${normalizedRoot}/`).toString()
  } else {
    baseUrl = `${normalizedRoot}${normalizedPath}`
  }

  if (!search) {
    return baseUrl
  }

  const normalizedSearch = search.startsWith("?") ? search : `?${search}`
  return `${baseUrl}${normalizedSearch}`
}
