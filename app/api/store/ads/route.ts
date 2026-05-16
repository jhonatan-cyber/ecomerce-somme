import { getRemoteStoreAdsUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET() {
  return proxyStoreGet(
    getRemoteStoreAdsUrl(),
    "No se pudieron consultar las publicidades del storefront.",
  )
}
