import { NextRequest } from "next/server"
import { getRemoteStoreOrdersUrl } from "@/lib/server-store-api"
import { buildForwardedResponse, buildProxyError } from "@/lib/server-store-proxy"
import { fetchStoreRemote } from "@/lib/store-api-root"

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const response = await fetchStoreRemote(getRemoteStoreOrdersUrl(id))

    // cacheControl explícito: las respuestas de pedidos nunca deben cachearse,
    // aunque el upstream envíe su propio cache-control.
    return buildForwardedResponse(response, { cacheControl: "no-store" })
  } catch (error) {
    console.error("Error proxying storefront order lookup:", error)
    return buildProxyError("No se pudo consultar el pedido en el dashboard.")
  }
}
