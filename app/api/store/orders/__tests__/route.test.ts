import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "@/app/api/store/orders/route"

const originalFetch = global.fetch

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve('{"id":"ord-1","success":true}'),
    headers: new Headers({ "content-type": "application/json" }),
  }) as any
})

afterEach(() => {
  global.fetch = originalFetch
  delete process.env.NEXT_PUBLIC_API_URL
})

function makeOrderRequest(body: string) {
  return new NextRequest("https://example.com/api/store/orders", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  })
}

describe("POST /api/store/orders", () => {
  it("proxies order creation successfully", async () => {
    const req = makeOrderRequest(JSON.stringify({ customer: { name: "Test" }, items: [] }))
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it("returns 502 with the route-specific message on fetch failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as any
    const req = makeOrderRequest(JSON.stringify({ customer: { name: "Test" } }))
    const res = await POST(req)
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body).toEqual({ error: "No se pudo conectar con el dashboard para crear el pedido." })
  })

  it("forwards upstream error status", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      text: () => Promise.resolve('{"error":"Invalid data"}'),
      headers: new Headers({ "content-type": "application/json" }),
    }) as any
    const req = makeOrderRequest(JSON.stringify({ invalid: true }))
    const res = await POST(req)
    expect(res.status).toBe(422)
  })
})
