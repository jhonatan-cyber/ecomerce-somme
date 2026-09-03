import { NextResponse } from "next/server"

// Liveness probe para pm2/deploy y monitoreo externo. No toca la API del
// dashboard a propósito: debe responder 200 aunque el backend caiga.
export async function GET() {
  return NextResponse.json(
    { status: "ok", service: "somme-ecommerce", timestamp: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  )
}
