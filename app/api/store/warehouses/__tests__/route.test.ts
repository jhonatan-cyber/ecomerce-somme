import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { GET } from "@/app/api/store/warehouses/route"

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

describe("GET /api/store/warehouses", () => {
  it("returns warehouses from first candidate URL", async () => {
    mockFetchJson({ data: [{ id: "w1", name: "Warehouse 1" }] })
    const res = await GET()
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].id).toBe("w1")
  })

  it("tries candidates in preference order (/warehouses, /deposits, /branches?type=warehouse)", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (String(url).includes("/warehouses")) {
        return Promise.resolve({ ok: false, json: () => Promise.resolve(null) })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: "d1", name: "Deposito 1" }] }),
      })
    }) as any

    const res = await GET()
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].id).toBe("d1")

    const urls = (global.fetch as any).mock.calls.map((call: unknown[]) => String(call[0]))
    expect(urls[0]).toBe("https://api.example.com/store/warehouses")
    expect(urls[1]).toBe("https://api.example.com/store/deposits")
  })

  it("falls back through all three candidates in order and returns empty data when all fail", async () => {
    let callCount = 0
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++
      return Promise.resolve({ ok: false, json: () => Promise.resolve(null) })
    }) as any

    const res = await GET()
    const body = await res.json()
    expect(body.data).toEqual([])
    expect(callCount).toBe(3)

    const urls = (global.fetch as any).mock.calls.map((call: unknown[]) => String(call[0]))
    expect(urls).toEqual([
      "https://api.example.com/store/warehouses",
      "https://api.example.com/store/deposits",
      "https://api.example.com/store/branches?type=warehouse",
    ])
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
