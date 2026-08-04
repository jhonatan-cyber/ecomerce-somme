import { NextRequest } from "next/server"
import { getRemoteStoreOrdersUrl } from "@/lib/server-store-api"
import { buildForwardedResponse, buildProxyError } from "@/lib/server-store-proxy"
import { fetchStoreRemote } from "@/lib/store-api-root"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const response = await fetchStoreRemote(getRemoteStoreOrdersUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    // cacheControl explícito: las respuestas de escritura nunca deben cachearse,
    // aunque el upstream envíe su propio cache-control.
    return buildForwardedResponse(response, { cacheControl: "no-store" })
  } catch (error) {
    console.error("Error proxying store order creation:", error)
    return buildProxyError("No se pudo conectar con el dashboard para crear el pedido.")
  }
}
