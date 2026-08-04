import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "@/app/api/store/quote-requests/route"

const originalFetch = global.fetch

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve('{"success":true}'),
    headers: new Headers({ "content-type": "application/json" }),
  }) as any
})

afterEach(() => {
  global.fetch = originalFetch
  delete process.env.NEXT_PUBLIC_API_URL
})

function makeRequest(body: string, ip = "1.2.3.4") {
  return new NextRequest("https://example.com/api/store/quote-requests", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
  })
}

describe("POST /api/store/quote-requests", () => {
  it("proxies successful request", async () => {
    const req = makeRequest(JSON.stringify({ name: "Test", items: [] }))
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it("returns 429 when rate limited", async () => {
    const ip = "10.0.0.1"
    // Exhaust rate limit (8 attempts per 10 min window)
    for (let i = 0; i < 9; i++) {
      const req = makeRequest(JSON.stringify({ name: "Test" }), ip)
      await POST(req)
    }
    const req = makeRequest(JSON.stringify({ name: "Test" }), ip)
    const res = await POST(req)
    expect(res.status).toBe(429)
  })

  it("returns 502 with the route-specific message on fetch failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as any
    const req = makeRequest(JSON.stringify({ name: "Test" }))
    const res = await POST(req)
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body).toEqual({ error: "No se pudo conectar con el dashboard para registrar la solicitud." })
  })
})
