/**
 * Proxy server-only del storefront (forwarding HTTP hacia la API del dashboard).
 *
 * ── FRONTERA CLIENTE/SERVIDOR ────────────────────────────────────────────
 * Este módulo es EXCLUSIVAMENTE server-side: importa `next/server`
 * (NextResponse), que no puede instanciarse en el navegador. Lo protegen dos
 * capas: `import "server-only"` (falla en build-time si un bundle de cliente
 * lo importa) y el lint de CI `lint:boundary` (scripts/lint-client-boundary.js,
 * que rechaza cualquier archivo con "use client" que lo importe).
 *
 * Qué puede importar: solo módulos server-only (next/server) y el transporte
 * isomórfico de store-api-root.ts (fetchStoreRemote), que no arrastra
 * next/server. No debe importarse desde componentes ni hooks de cliente.
 *
 * Exporta: proxyStoreGet (proxy GET de catálogo) y los moldes de respuesta
 * buildForwardedResponse / buildProxyError, usados también por las rutas de
 * orders/quote-requests. La contraparte isomórfica es store-api-root.ts;
 * la división existe justamente por la frontera next/server.
 */
import "server-only"

import { NextResponse } from "next/server"
import { fetchStoreRemote } from "./store-api-root"

const isDevelopment = process.env.NODE_ENV !== "production"

export interface BuildForwardedResponseOptions {
  /**
   * Cache-Control a forzar en la respuesta reenviada. Cuando no se pasa, se
   * reenvía el del upstream con fallback a "no-store" (passthrough del proxy).
   * Los proxies de escritura (orders/quote-requests) lo fuerzan a "no-store".
   */
  cacheControl?: string
}

/**
 * Construye la NextResponse de forwarding a partir de la Response del upstream:
 * copia status + body (text), y aplica content-type (con fallback a
 * application/json cuando el upstream no lo manda) y cache-control. Antes este
 * molde estaba duplicado en proxyStoreGet, el POST de orders, el GET de
 * orders/[id] y el POST de quote-requests.
 */
export async function buildForwardedResponse(
  response: Response,
  options: BuildForwardedResponseOptions = {},
): Promise<NextResponse> {
  const payload = await response.text()

  return new NextResponse(payload, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
      "Cache-Control": options.cacheControl ?? response.headers.get("cache-control") ?? "no-store",
    },
  })
}

/**
 * Construye la respuesta de error 502 del proxy: `{ error: message }`. Antes
 * este molde estaba duplicado en el catch de proxyStoreGet, el POST de orders,
 * el GET de orders/[id] y el POST de quote-requests. Cada caller mantiene su
 * propio console.error (mensajes y prefijos distintos) y delega aquí solo el
 * molde de la respuesta.
 */
export function buildProxyError(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 502 })
}

export async function proxyStoreGet(remoteUrl: string, errorMessage: string) {
  if (isDevelopment) {
    console.log(`[proxyStoreGet] Fetching from: ${remoteUrl}`)
  }
  try {
    const response = await fetchStoreRemote(remoteUrl)

    if (isDevelopment) {
      console.log(`[proxyStoreGet] Response status: ${response.status}`)
    }

    return buildForwardedResponse(response)
  } catch (error) {
    console.error(`[proxyStoreGet] ${errorMessage}`, error)
    return buildProxyError(errorMessage)
  }
}
