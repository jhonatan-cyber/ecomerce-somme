import { getRemoteStoreSlidesUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET() {
  return proxyStoreGet(
    getRemoteStoreSlidesUrl(),
    "No se pudieron consultar los slides del storefront.",
  )
}
