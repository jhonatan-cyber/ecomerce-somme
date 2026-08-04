import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { buildForwardedResponse, buildProxyError, proxyStoreGet } from "@/lib/server-store-proxy"

const originalFetch = global.fetch

beforeEach(() => {
  global.fetch = vi.fn()
})

afterEach(() => {
  global.fetch = originalFetch
})

function mockFetch(status: number, body: string, headers: Record<string, string> = {}) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body),
    headers: new Headers(headers),
  }) as any
}

describe("proxyStoreGet", () => {
  it("proxies successful response", async () => {
    mockFetch(200, '{"data":[]}', { "content-type": "application/json" })
    const res = await proxyStoreGet("https://api.example.com/products", "error")
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ data: [] })
  })

  it("proxies error status from upstream", async () => {
    mockFetch(404, '{"error":"not found"}')
    const res = await proxyStoreGet("https://api.example.com/missing", "error")
    expect(res.status).toBe(404)
  })

  it("returns 502 on fetch failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network fail")) as any
    const res = await proxyStoreGet("https://api.example.com/products", "Catalogo no disponible")
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe("Catalogo no disponible")
  })

  it("sets no-store cache header", async () => {
    mockFetch(200, '[]')
    const res = await proxyStoreGet("https://api.example.com/slides", "error")
    expect(res.headers.get("cache-control")).toBe("no-store")
  })
})

describe("buildForwardedResponse", () => {
  function upstreamResponse(
    status: number,
    body: string,
    headers: Record<string, string> = {},
  ): Response {
    return {
      status,
      text: () => Promise.resolve(body),
      headers: new Headers(headers),
    } as unknown as Response
  }

  it("forwards status and body", async () => {
    const res = await buildForwardedResponse(upstreamResponse(201, '{"id":"x"}'))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toEqual({ id: "x" })
  })

  it("falls back content-type to application/json when upstream omits it", async () => {
    const res = await buildForwardedResponse(upstreamResponse(200, '{"data":[]}'))
    expect(res.headers.get("content-type")).toBe("application/json")
  })

  it("passes through upstream content-type and cache-control by default", async () => {
    const res = await buildForwardedResponse(
      upstreamResponse(200, '{}', {
        "content-type": "application/vnd.api+json",
        "cache-control": "public, max-age=300",
      }),
    )
    expect(res.headers.get("content-type")).toBe("application/vnd.api+json")
    expect(res.headers.get("cache-control")).toBe("public, max-age=300")
  })

  it("falls back cache-control to no-store when upstream omits it and no option given", async () => {
    const res = await buildForwardedResponse(upstreamResponse(200, '{}'))
    expect(res.headers.get("cache-control")).toBe("no-store")
  })

  it("forces cache-control when option provided (writes contract)", async () => {
    const res = await buildForwardedResponse(upstreamResponse(200, '{}'), {
      cacheControl: "no-store",
    })
    expect(res.headers.get("cache-control")).toBe("no-store")
  })

  it("option cache-control overrides upstream cache-control", async () => {
    const res = await buildForwardedResponse(
      upstreamResponse(200, '{}', { "cache-control": "public, max-age=300" }),
      { cacheControl: "no-store" },
    )
    expect(res.headers.get("cache-control")).toBe("no-store")
  })
})

describe("buildProxyError", () => {
  it("returns 502 with the given error message", async () => {
    const res = buildProxyError("Dashboard no disponible")
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body).toEqual({ error: "Dashboard no disponible" })
  })

})
