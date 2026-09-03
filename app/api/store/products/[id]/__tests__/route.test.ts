import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "@/app/api/store/products/[id]/route"

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

describe("GET /api/store/products/[id]", () => {
  it("reenvía el detalle y usa el id en la URL remota", async () => {
    mockOk({ data: { id: "p1", name: "Camara 4K" } })
    const req = new NextRequest("http://localhost:5001/api/store/products/p1")
    const res = await GET(req, { params: Promise.resolve({ id: "p1" }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.id).toBe("p1")
    const calledUrl = (global.fetch as any).mock.calls[0][0] as string
    expect(calledUrl).toContain("/products/p1")
  })

  it("devuelve 502 ante error de red", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as any
    const req = new NextRequest("http://localhost:5001/api/store/products/p1")
    const res = await GET(req, { params: Promise.resolve({ id: "p1" }) })
    expect(res.status).toBe(502)
  })
})
