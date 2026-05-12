import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function resolveStoreRoot() {
  const explicitStoreRoot = process.env.NEXT_PUBLIC_STORE_API_URL?.trim()
  if (explicitStoreRoot) return explicitStoreRoot.replace(/\/$/, "")

  const apiRoot = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!apiRoot) return null

  const normalizedApiRoot = apiRoot.replace(/\/$/, "")
  return normalizedApiRoot.endsWith("/store")
    ? normalizedApiRoot
    : `${normalizedApiRoot}/store`
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    cache: "no-store",
  })

  if (!response.ok) return null
  return (await response.json().catch(() => null)) as { data?: unknown[] } | null
}

export async function GET() {
  try {
    const root = resolveStoreRoot()
    if (!root) return NextResponse.json({ data: [] })

    const candidates = [
      `${root}/warehouses`,
      `${root}/deposits`,
      `${root}/branches?type=warehouse`,
    ]

    for (const url of candidates) {
      const payload = await fetchJson(url)
      if (Array.isArray(payload?.data)) {
        return NextResponse.json({ data: payload.data })
      }
    }

    return NextResponse.json({ data: [] })
  } catch (error) {
    console.error("No se pudieron consultar los depositos del catalogo.", error)
    return NextResponse.json({ data: [] })
  }
}
