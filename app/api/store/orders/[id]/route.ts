import { NextRequest, NextResponse } from "next/server"
import { getRemoteStoreOrdersUrl } from "@/lib/server-store-api"

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const response = await fetch(getRemoteStoreOrdersUrl(id), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    const payload = await response.text()

    return new NextResponse(payload, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Error proxying storefront order lookup:", error)
    return NextResponse.json(
      { error: "No se pudo consultar el pedido en el dashboard." },
      { status: 502 },
    )
  }
}
