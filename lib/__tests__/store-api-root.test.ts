import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  resolveStoreApiRoot,
  resolveStoreApiRootOrNull,
  joinStoreApiUrl,
  buildStoreApiUrl,
  fetchStoreJson,
  fetchFirstStoreData,
  fetchStoreRemote,
} from "@/lib/store-api-root"

describe("resolveStoreApiRoot", () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it("returns /api/store in client contexts (jsdom has window)", () => {
    expect(resolveStoreApiRoot()).toBe("/api/store")
  })

  it("respects NEXT_PUBLIC_STORE_API_URL in browser contexts when set", () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://remote.store/api/store/"
    expect(resolveStoreApiRoot()).toBe("https://remote.store/api/store")
  })

  it("falls back to /api/store in browser when NEXT_PUBLIC_STORE_API_URL is unset", () => {
    delete process.env.NEXT_PUBLIC_STORE_API_URL
    expect(resolveStoreApiRoot()).toBe("/api/store")
  })

  it("honors a relative NEXT_PUBLIC_STORE_API_URL in the browser", () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "/custom-store"
    expect(resolveStoreApiRoot()).toBe("/custom-store")
  })

  it("keeps the server-side path (clientFallback: false) unaffected by the browser change", () => {
    // Solo NEXT_PUBLIC_API_URL configurada (caso del CI): el servidor deriva
    // /store, el navegador mantiene el proxy.
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    delete process.env.NEXT_PUBLIC_STORE_API_URL
    expect(resolveStoreApiRoot({ clientFallback: false })).toBe("https://api.example.com/store")
    expect(resolveStoreApiRoot()).toBe("/api/store")
  })

  it("uses env-based resolution when clientFallback is false", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    expect(resolveStoreApiRoot({ clientFallback: false })).toBe("https://api.example.com/store")
  })

  it("uses NEXT_PUBLIC_STORE_API_URL when set (server-side)", () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://store.example.com/api/store/"
    const root = resolveStoreApiRoot({ clientFallback: false })
    expect(root).toBe("https://store.example.com/api/store")
  })

  it("appends /store to NEXT_PUBLIC_API_URL when it does not end with /store", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    const root = resolveStoreApiRoot({ clientFallback: false })
    expect(root).toBe("https://api.example.com/store")
  })

  it("keeps NEXT_PUBLIC_API_URL unchanged when it already ends with /store", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/store"
    const root = resolveStoreApiRoot({ clientFallback: false })
    expect(root).toBe("https://api.example.com/store")
  })

  it("strips trailing slashes from NEXT_PUBLIC_API_URL", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/"
    const root = resolveStoreApiRoot({ clientFallback: false })
    expect(root).toBe("https://api.example.com/store")
  })

  it("throws when no env var is configured and throwIfMissing is true", () => {
    delete process.env.NEXT_PUBLIC_STORE_API_URL
    delete process.env.NEXT_PUBLIC_API_URL
    expect(() => resolveStoreApiRoot({ clientFallback: false, throwIfMissing: true })).toThrow(
      /NEXT_PUBLIC_STORE_API_URL|NEXT_PUBLIC_API_URL/,
    )
  })

  it("falls back to /api/store when nothing is configured and throwIfMissing is false", () => {
    delete process.env.NEXT_PUBLIC_STORE_API_URL
    delete process.env.NEXT_PUBLIC_API_URL
    expect(resolveStoreApiRoot({ clientFallback: false })).toBe("/api/store")
  })
})

describe("resolveStoreApiRootOrNull", () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it("returns NEXT_PUBLIC_STORE_API_URL when set (server-side)", () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://remote.store/api/store"
    expect(resolveStoreApiRootOrNull()).toBe("https://remote.store/api/store")
  })

  it("derives /store from NEXT_PUBLIC_API_URL", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    expect(resolveStoreApiRootOrNull()).toBe("https://api.example.com/store")
  })

  it("returns null when no env vars are configured (graceful degradation)", () => {
    delete process.env.NEXT_PUBLIC_STORE_API_URL
    delete process.env.NEXT_PUBLIC_API_URL
    expect(resolveStoreApiRootOrNull()).toBeNull()
  })
})

describe("buildStoreApiUrl", () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it("resolves the root and joins the path in one step (client fallback)", () => {
    expect(buildStoreApiUrl("/products")).toBe("/api/store/products")
  })

  it("builds remote URLs from NEXT_PUBLIC_STORE_API_URL in browser contexts", () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://remote.store/api/store"
    expect(buildStoreApiUrl("/products")).toBe("https://remote.store/api/store/products")
  })

  it("honors options for server-side resolution", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    expect(buildStoreApiUrl("/products", { clientFallback: false })).toBe(
      "https://api.example.com/store/products",
    )
  })

  it("does not double /store when the API root already ends with /store", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/store"
    expect(buildStoreApiUrl("/quote-requests", { clientFallback: false })).toBe(
      "https://api.example.com/store/quote-requests",
    )
  })

  it("appends a search string", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    expect(buildStoreApiUrl("/products", { clientFallback: false }, "camera")).toBe(
      "https://api.example.com/store/products?camera",
    )
  })

  it("throws when strict options require env vars that are missing", () => {
    delete process.env.NEXT_PUBLIC_STORE_API_URL
    delete process.env.NEXT_PUBLIC_API_URL
    expect(() => buildStoreApiUrl("/orders", { clientFallback: false, throwIfMissing: true })).toThrow(
      /NEXT_PUBLIC_STORE_API_URL|NEXT_PUBLIC_API_URL/,
    )
  })
})

describe("fetchStoreRemote", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns the raw Response without parsing", async () => {
    const rawResponse = { ok: true, status: 200, json: () => Promise.resolve({ any: "shape" }) }
    const fetchMock = vi.fn().mockResolvedValue(rawResponse)
    vi.stubGlobal("fetch", fetchMock)

    const response = await fetchStoreRemote("https://api.example.com/store/slides")
    expect(response).toBe(rawResponse)
  })

  it("defaults to GET, Accept json, no-store and ngrok header", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    vi.stubGlobal("fetch", fetchMock)

    await fetchStoreRemote("https://api.example.com/store/slides")

    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/store/slides", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    })
  })

  it("merges caller init without dropping the shared headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    vi.stubGlobal("fetch", fetchMock)

    await fetchStoreRemote("https://api.example.com/store/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    })

    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/store/orders", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: "{}",
    })
  })
})

describe("contract: fetchStoreRemote returns the raw Response while fetchStoreJson degrades (transport without semantics)", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("on !ok upstream: transport returns the raw Response while fetchStoreJson degrades to null", async () => {
    const upstream = { ok: false, status: 422, json: () => Promise.resolve({ error: "x" }) }
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(upstream))

    // El transporte devuelve la Response cruda sin interpretarla: necesaria
    // para que proxyStoreGet reenvíe el status 422 al cliente.
    const raw = await fetchStoreRemote("https://api.example.com/store/orders")
    expect(raw).toBe(upstream)
    expect(raw.status).toBe(422)

    // fetchStoreJson aplica degradación sobre el mismo upstream: !ok -> null
    // (las rutas de catálogo responden { data: [] }).
    expect(await fetchStoreJson("https://api.example.com/store/orders")).toBeNull()
  })

  it("on ok upstream: transport returns the raw Response and fetchStoreJson parses the payload", async () => {
    const upstream = {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: [{ id: "b1" }] }),
    }
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(upstream))

    const raw = await fetchStoreRemote("https://api.example.com/store/branches")
    expect(raw).toBe(upstream)

    expect(await fetchStoreJson("https://api.example.com/store/branches")).toEqual({
      data: [{ id: "b1" }],
    })
  })
})

describe("fetchStoreJson", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns the parsed payload when the response is ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: "b1" }] }),
      }),
    )

    const payload = await fetchStoreJson("https://api.example.com/store/branches")
    expect(payload).toEqual({ data: [{ id: "b1" }] })
  })

  it("returns null when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(null),
      }),
    )

    expect(await fetchStoreJson("https://api.example.com/store/branches")).toBeNull()
  })

  it("returns null when the JSON is unparseable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error("invalid json")),
      }),
    )

    expect(await fetchStoreJson("https://api.example.com/store/branches")).toBeNull()
  })

  it("requests with GET, Accept json, no-store and ngrok header", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    })
    vi.stubGlobal("fetch", fetchMock)

    await fetchStoreJson("https://api.example.com/store/branches")

    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/store/branches", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    })
  })
})

describe("fetchFirstStoreData", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns the first candidate whose data is an array", async () => {
    let callCount = 0
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ ok: false, json: () => Promise.resolve(null) })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: "b2" }] }),
        })
      }),
    )

    const result = await fetchFirstStoreData([
      "https://api.example.com/store/branches?type=branch",
      "https://api.example.com/store/branches",
    ])
    expect(result).toEqual([{ id: "b2" }])
    expect(callCount).toBe(2)
  })

  it("returns null when no candidate responds with an array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: null }),
      }),
    )

    const result = await fetchFirstStoreData(["https://api.example.com/store/branches"])
    expect(result).toBeNull()
  })

  it("treats an empty array as valid data (does not fall through to next candidate)", async () => {
    let callCount = 0
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => {
        callCount++
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] }),
        })
      }),
    )

    const result = await fetchFirstStoreData([
      "https://api.example.com/store/branches",
      "https://api.example.com/store/branches?type=branch",
    ])
    expect(result).toEqual([])
    expect(callCount).toBe(1)
  })
})

describe("joinStoreApiUrl", () => {
  it("joins absolute root with path", () => {
    expect(joinStoreApiUrl("https://api.example.com/store", "/products")).toBe(
      "https://api.example.com/store/products",
    )
  })

  it("joins relative root with path", () => {
    expect(joinStoreApiUrl("/api/store", "orders")).toBe("/api/store/orders")
  })

  it("handles root with trailing slash", () => {
    expect(joinStoreApiUrl("https://api.example.com/store/", "/products")).toBe(
      "https://api.example.com/store/products",
    )
  })

  it("appends search string", () => {
    expect(joinStoreApiUrl("https://api.example.com/store", "/products", "camera")).toBe(
      "https://api.example.com/store/products?camera",
    )
  })

  it("does not double the ? when search already has it", () => {
    expect(joinStoreApiUrl("https://api.example.com/store", "/products", "?camera")).toBe(
      "https://api.example.com/store/products?camera",
    )
  })
})
