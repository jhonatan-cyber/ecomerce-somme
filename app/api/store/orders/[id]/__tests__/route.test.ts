import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "@/app/api/store/orders/[id]/route"

const originalFetch = global.fetch

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve('{"id":"ord-1","status":"pending"}'),
    headers: new Headers({ "content-type": "application/json" }),
  }) as any
})

afterEach(() => {
  global.fetch = originalFetch
  delete process.env.NEXT_PUBLIC_API_URL
})

function makeGetRequest() {
  return new NextRequest("https://example.com/api/store/orders/ord-1")
}

describe("GET /api/store/orders/[id]", () => {
  it("fetches order by id", async () => {
    const req = makeGetRequest()
    const res = await GET(req, { params: Promise.resolve({ id: "ord-1" }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe("ord-1")
  })

  it("returns 502 with the route-specific message on fetch failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as any
    const req = makeGetRequest()
    const res = await GET(req, { params: Promise.resolve({ id: "ord-1" }) })
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body).toEqual({ error: "No se pudo consultar el pedido en el dashboard." })
  })

  it("forwards upstream error status", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve('{"error":"not found"}'),
      headers: new Headers(),
    }) as any
    const req = makeGetRequest()
    const res = await GET(req, { params: Promise.resolve({ id: "missing" }) })
    expect(res.status).toBe(404)
  })
})
