import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "@/app/api/store/branches/route"

const originalFetch = global.fetch

beforeEach(() => {
  vi.resetModules()
  process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
  global.fetch = vi.fn()
})

afterEach(() => {
  global.fetch = originalFetch
  delete process.env.NEXT_PUBLIC_API_URL
  delete process.env.NEXT_PUBLIC_STORE_API_URL
})

function mockFetchJson(data: unknown, ok = true) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  }) as any
}

describe("GET /api/store/branches", () => {
  it("returns branches from first candidate URL", async () => {
    mockFetchJson({ data: [{ id: "b1", name: "Branch 1" }] })
    const res = await GET()
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].id).toBe("b1")
  })

  it("falls back to second candidate URL when first fails", async () => {
    let callCount = 0
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        return Promise.resolve({ ok: false, json: () => Promise.resolve(null) })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: "b2", name: "Branch 2" }] }),
      })
    }) as any

    const res = await GET()
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(callCount).toBe(2)
  })

  it("returns empty data when all URLs fail", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(null),
    }) as any

    const res = await GET()
    const body = await res.json()
    expect(body.data).toEqual([])
  })

  it("returns empty data when no API URL configured", async () => {
    delete process.env.NEXT_PUBLIC_API_URL
    delete process.env.NEXT_PUBLIC_STORE_API_URL
    const res = await GET()
    const body = await res.json()
    expect(body.data).toEqual([])
  })

  it("returns empty data on fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as any
    const res = await GET()
    const body = await res.json()
    expect(body.data).toEqual([])
  })
})
