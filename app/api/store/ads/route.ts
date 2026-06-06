import { getRemoteStoreAdsUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET() {
  const remoteUrl = getRemoteStoreAdsUrl()
  console.log(`[API /api/store/ads] Proxying to remote URL: ${remoteUrl}`)
  return proxyStoreGet(
    remoteUrl,
    "No se pudieron consultar las publicidades del storefront.",
  )
}
