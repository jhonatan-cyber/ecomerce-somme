import { NextResponse } from "next/server"
import { fetchFirstStoreData, resolveStoreApiRootOrNull } from "@/lib/store-api-root"

export const dynamic = "force-dynamic"

// URLs candidatas de la API del storefront, en orden de preferencia.
const candidates = (root: string) => [
  `${root}/branches?type=branch`,
  `${root}/branches`,
]

export async function GET() {
  try {
    const root = resolveStoreApiRootOrNull()
    if (!root) return NextResponse.json({ data: [] })

    const data = await fetchFirstStoreData(candidates(root))
    return NextResponse.json({ data: data ?? [] })
  } catch (error) {
    console.error("No se pudieron consultar las sucursales del catalogo.", error)
    return NextResponse.json({ data: [] })
  }
}
