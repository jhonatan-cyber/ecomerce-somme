import { NextRequest, NextResponse } from "next/server"

import { getRemoteStoreQuoteRequestsUrl } from "@/lib/server-store-api"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const response = await fetch(getRemoteStoreQuoteRequestsUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
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
    console.error("Error proxying store quote request creation:", error)
    return NextResponse.json(
      { error: "No se pudo conectar con el dashboard para registrar la solicitud." },
      { status: 502 },
    )
  }
}
