import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { GET } from "@/app/api/store/slides/route"

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

describe("GET /api/store/slides", () => {
  it("reenvía los slides del upstream", async () => {
    mockOk({ data: [{ id: "s1" }] })
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
  })

  it("devuelve 502 ante error de red", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as any
    const res = await GET()
    expect(res.status).toBe(502)
  })
})
