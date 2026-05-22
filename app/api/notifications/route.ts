import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limitParam = Number.parseInt(searchParams.get("limit") ?? "12", 10)
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 12

  return NextResponse.json({
    notifications: [],
    unreadCount: 0,
    limit,
  })
}
