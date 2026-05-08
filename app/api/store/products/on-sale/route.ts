import { getRemoteStoreOnSaleProductsUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET() {
  return proxyStoreGet(
    getRemoteStoreOnSaleProductsUrl(),
    "No se pudieron consultar los productos en promocion.",
  )
}
