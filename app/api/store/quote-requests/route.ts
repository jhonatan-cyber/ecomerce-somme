import { NextRequest, NextResponse } from "next/server"

import { getRemoteStoreQuoteRequestsUrl } from "@/lib/server-store-api"
import { consumeRateLimit, getClientIpFromRequest } from "@/lib/server/rate-limit"

export const dynamic = "force-dynamic"
const QUOTE_WINDOW_MS = 10 * 60 * 1000
const QUOTE_BLOCK_MS = 10 * 60 * 1000
const QUOTE_MAX_ATTEMPTS = 8

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIpFromRequest(request.headers)
    const attempt = consumeRateLimit({
      key: `store-quote-request:${ip}`,
      windowMs: QUOTE_WINDOW_MS,
      maxAttempts: QUOTE_MAX_ATTEMPTS,
      blockMs: QUOTE_BLOCK_MS,
    })

    if (!attempt.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta nuevamente mas tarde." },
        {
          status: 429,
          headers: {
            "Retry-After": String(attempt.retryAfterSeconds),
          },
        },
      )
    }

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
