import { getRemoteStoreCategoriesUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET() {
  return proxyStoreGet(
    getRemoteStoreCategoriesUrl(),
    "No se pudieron consultar las categorias del catalogo.",
  )
}
