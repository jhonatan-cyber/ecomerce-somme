// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

/**
 * Server-side regression test for the double "/store" bug.
 *
 * In jsdom, resolveStoreApiRoot() short-circuits to the hardcoded
 * "/api/store" client fallback, so the old local helpers (resolveApiRoot +
 * joinRootUrl) and the shared resolver produced identical URLs. The bug only
 * manifests when the API root is resolved from environment variables on the
 * server: if NEXT_PUBLIC_STORE_API_URL / NEXT_PUBLIC_API_URL already ended
 * with "/store", the old joinRootUrl(API_ROOT, "/store/quote-requests")
 * produced "/store/store/quote-requests".
 *
 * These tests run in the node environment (window undefined) so the env-var
 * branch of resolveStoreApiRoot is exercised, and assert the URL has exactly
 * one "/store" segment.
 */

const ORIGINAL_ENV = { ...process.env }

function mockFetchOk() {
  return vi.fn().mockResolvedValue(
    new Response(
      JSON.stringify({
        success: true,
        request: { id: "q-1", code: "COT-1", status: "pending", createdAt: "2026-01-01" },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    ),
  )
}

async function createQuoteRequestWithEnv(env: Record<string, string>) {
  vi.resetModules()
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value)
  }

  const fetchMock = mockFetchOk()
  vi.stubGlobal("fetch", fetchMock)

  const { createQuoteRequest } = await import("@/lib/api")
  await createQuoteRequest({
    customer: { name: "Cliente", phone: "123", address: "Calle 1" },
    products: [{ product_id: "p-1", quantity: 1 }],
    project_type: "residential",
    installation_required: false,
  })

  return fetchMock
}

describe("createQuoteRequest store root resolution (server-side)", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it("keeps a single /store when NEXT_PUBLIC_STORE_API_URL already ends with /store", async () => {
    const fetchMock = await createQuoteRequestWithEnv({
      NEXT_PUBLIC_STORE_API_URL: "https://api.example.com/store",
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url] = fetchMock.mock.calls[0]
    expect(url).toBe("https://api.example.com/store/quote-requests")
    expect(url).not.toContain("/store/store")
  })

  it("keeps a single /store when NEXT_PUBLIC_API_URL already ends with /store", async () => {
    const fetchMock = await createQuoteRequestWithEnv({
      NEXT_PUBLIC_API_URL: "https://api.example.com/store",
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url] = fetchMock.mock.calls[0]
    expect(url).toBe("https://api.example.com/store/quote-requests")
    expect(url).not.toContain("/store/store")
  })

  it("appends /store to a plain API root", async () => {
    const fetchMock = await createQuoteRequestWithEnv({
      NEXT_PUBLIC_API_URL: "https://api.example.com",
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url] = fetchMock.mock.calls[0]
    expect(url).toBe("https://api.example.com/store/quote-requests")
  })

  it("falls back to /api/store when no env vars are set", async () => {
    // test/setup.ts sets NEXT_PUBLIC_API_URL globally; blank it out to
    // simulate a server with no storefront API configured.
    const fetchMock = await createQuoteRequestWithEnv({
      NEXT_PUBLIC_STORE_API_URL: "",
      NEXT_PUBLIC_API_URL: "",
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url] = fetchMock.mock.calls[0]
    expect(url).toBe("/api/store/quote-requests")
  })
})
