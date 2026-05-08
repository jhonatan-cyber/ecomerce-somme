import { NextRequest } from "next/server"
import { getRemoteStoreProductDetailUrl } from "@/lib/server-store-api"
import { proxyStoreGet } from "@/lib/server-store-proxy"

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  return proxyStoreGet(
    getRemoteStoreProductDetailUrl(id),
    "No se pudo consultar el detalle del producto.",
  )
}
