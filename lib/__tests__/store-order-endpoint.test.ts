import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { getStoreOrdersUrl } from "@/lib/store-order-endpoint"
import { buildStoreApiUrl } from "@/lib/store-api-root"

describe("getStoreOrdersUrl", () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  // resolveStoreApiRoot checks typeof window first — in jsdom it returns "/api/store"
  // These tests run in jsdom, so they test the client-side branch (window exists).
  // The server-side branch is tested via server-store-api.test.ts.

  it("returns /api/store/orders in client context (jsdom)", () => {
    const url = getStoreOrdersUrl()
    expect(url).toBe("/api/store/orders")
  })

  it("appends orderId in client context", () => {
    const url = getStoreOrdersUrl("ord-123")
    expect(url).toBe("/api/store/orders/ord-123")
  })

  it("encodes orderId with special characters", () => {
    const url = getStoreOrdersUrl("ord/123")
    expect(url).toContain("ord%2F123")
  })

  it("respects NEXT_PUBLIC_STORE_API_URL in direct mode (browser)", () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://remote.store/api/store"
    expect(getStoreOrdersUrl()).toBe("https://remote.store/api/store/orders")
    expect(getStoreOrdersUrl("ord-123")).toBe("https://remote.store/api/store/orders/ord-123")
    expect(getStoreOrdersUrl()).not.toBe("/api/store/orders")
  })

  it("is consistent with the buildStoreApiUrl path used by checkout fetches", () => {
    // checkout/page.tsx resuelve branches/settings con buildStoreApiUrl("/...")
    // y createOrder con getStoreOrdersUrl(); ambos deben resolver la misma raíz.
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://remote.store/api/store"
    expect(getStoreOrdersUrl()).toBe(buildStoreApiUrl("/orders"))
    expect(buildStoreApiUrl("/branches")).toBe("https://remote.store/api/store/branches")

    delete process.env.NEXT_PUBLIC_STORE_API_URL
    expect(getStoreOrdersUrl()).toBe(buildStoreApiUrl("/orders"))
    expect(buildStoreApiUrl("/branches")).toBe("/api/store/branches")
  })
})
