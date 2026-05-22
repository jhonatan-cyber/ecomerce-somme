import { getRemoteStoreSettingsUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET() {
  return proxyStoreGet(
    getRemoteStoreSettingsUrl(),
    "No se pudo cargar la configuracion del storefront.",
  )
}
