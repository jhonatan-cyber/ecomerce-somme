import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { GET } from "@/app/api/store/settings/route"

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

describe("GET /api/store/settings", () => {
  it("reenvía la configuración del upstream", async () => {
    mockOk({ data: { storeName: "Somme" } })
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.storeName).toBe("Somme")
  })

  it("devuelve 502 ante error de red", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as any
    const res = await GET()
    expect(res.status).toBe(502)
  })
})
