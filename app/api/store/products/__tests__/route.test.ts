import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "@/app/api/store/products/route"

const originalFetch = global.fetch

beforeEach(() => {
  vi.resetModules()
  process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
  global.fetch = vi.fn()
})

afterEach(() => {
  global.fetch = originalFetch
})

function mockOk(payload: unknown) {
  global.fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  ) as any
}

function req(search = "") {
  return new NextRequest(`http://localhost:5001/api/store/products${search}`)
}

describe("GET /api/store/products", () => {
  it("reenvía el catálogo y propaga el query al upstream", async () => {
    mockOk({ data: [{ id: "p1", name: "Camara 4K" }] })
    const res = await req("?search=camara")
    const out = await GET(res)
    expect(out.status).toBe(200)
    const body = await out.json()
    expect(body.data).toHaveLength(1)
    const calledUrl = (global.fetch as any).mock.calls[0][0] as string
    expect(calledUrl).toContain("search=camara")
  })

  it("devuelve 502 ante error de red", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as any
    const out = await GET(req())
    expect(out.status).toBe(502)
    const body = await out.json()
    expect(body.error).toBeTruthy()
  })
})
