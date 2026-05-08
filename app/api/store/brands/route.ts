import { getRemoteStoreBrandsUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET() {
  return proxyStoreGet(
    getRemoteStoreBrandsUrl(),
    "No se pudieron consultar las marcas del catalogo.",
  )
}
