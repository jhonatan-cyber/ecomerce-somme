import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { GET } from "@/app/api/store/categories/route"

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

describe("GET /api/store/categories", () => {
  it("reenvía el payload del upstream", async () => {
    mockOk({ data: [{ id: "c1", name: "Camaras" }] })
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].id).toBe("c1")
  })

  it("devuelve 502 ante error de red", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as any
    const res = await GET()
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })
})
