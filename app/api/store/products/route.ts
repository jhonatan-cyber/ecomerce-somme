import { NextRequest } from "next/server"
import { getRemoteStoreProductsUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const remoteUrl = getRemoteStoreProductsUrl(request.nextUrl.search)
  return proxyStoreGet(remoteUrl, "No se pudo consultar el catalogo de productos.")
}
