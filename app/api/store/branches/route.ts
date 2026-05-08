import { getRemoteStoreBranchesUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET() {
  return proxyStoreGet(
    getRemoteStoreBranchesUrl(),
    "No se pudieron consultar las sucursales del catalogo.",
  )
}
