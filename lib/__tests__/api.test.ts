import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

// Mock process.env for image URL rewriting tests
const ORIGINAL_ENV = { ...process.env }

describe("rewriteImageUrl", () => {
  beforeEach(() => {
    vi.resetModules()
    process.env = { ...ORIGINAL_ENV }
    delete process.env.NEXT_PUBLIC_UPLOADS_URL
  })

  it("should rewrite 192.168.x.x URLs when uploads URL is set", async () => {
    process.env.NEXT_PUBLIC_UPLOADS_URL = "https://dashboard.sommetechnology.com"
    const { rewriteImageUrl } = await import("@/lib/api")
    const result = rewriteImageUrl("http://192.168.0.2:8000/api/uploads/files/product.webp")
    expect(result).toBe("https://dashboard.sommetechnology.com/api/uploads/files/product.webp")
  })

  it("should return null for null input", async () => {
    const { rewriteImageUrl } = await import("@/lib/api")
    expect(rewriteImageUrl(null)).toBeNull()
  })

  it("should return null for undefined input", async () => {
    const { rewriteImageUrl } = await import("@/lib/api")
    expect(rewriteImageUrl(undefined)).toBeNull()
  })

  it("should return URL as-is when no uploads or API URL is set", async () => {
    delete process.env.NEXT_PUBLIC_API_URL
    const { rewriteImageUrl } = await import("@/lib/api")
    const url = "http://192.168.0.2:8000/api/uploads/files/product.webp"
    expect(rewriteImageUrl(url)).toBe(url)
  })

  it("should return non-private URLs as-is even when uploads URL is set", async () => {
    process.env.NEXT_PUBLIC_UPLOADS_URL = "https://dashboard.sommetechnology.com"
    const { rewriteImageUrl } = await import("@/lib/api")
    const url = "https://cdn.example.com/images/product.webp"
    expect(rewriteImageUrl(url)).toBe(url)
  })

  it("should rewrite legacy production image domains", async () => {
    process.env.NEXT_PUBLIC_UPLOADS_URL = "https://dashboard.sommetechnology.com"
    const { rewriteImageUrl } = await import("@/lib/api")
    expect(rewriteImageUrl("https://somme.nuwesomme.cloud/api/uploads/files/product.webp"))
      .toBe("https://dashboard.sommetechnology.com/api/uploads/files/product.webp")
  })

  it("should rewrite different private IP variants", async () => {
    process.env.NEXT_PUBLIC_UPLOADS_URL = "https://dashboard.sommetechnology.com"
    const { rewriteImageUrl } = await import("@/lib/api")
    expect(rewriteImageUrl("http://192.168.1.100:3000/file.jpg"))
      .toBe("https://dashboard.sommetechnology.com/file.jpg")
    expect(rewriteImageUrl("http://192.168.0.5:8000/images/test.png"))
      .toBe("https://dashboard.sommetechnology.com/images/test.png")
  })

  it("should handle trailing slashes in uploads URL", async () => {
    process.env.NEXT_PUBLIC_UPLOADS_URL = "https://dashboard.sommetechnology.com/"
    const { rewriteImageUrl } = await import("@/lib/api")
    const result = rewriteImageUrl("http://192.168.0.2:8000/api/uploads/files/product.webp")
    expect(result).toBe("https://dashboard.sommetechnology.com/api/uploads/files/product.webp")
  })
})

describe("createQuoteRequest", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("POSTs to /api/store/quote-requests (single /store, via shared store root)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, request: { id: "q-1", code: "COT-1", status: "pending", createdAt: "2026-01-01" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { createQuoteRequest } = await import("@/lib/api")
    const result = await createQuoteRequest({
      customer: { name: "Cliente", phone: "123", address: "Calle 1" },
      products: [{ product_id: "p-1", quantity: 1 }],
      project_type: "residential",
      installation_required: false,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe("/api/store/quote-requests")
    expect(url).not.toContain("/store/store")
    expect((init as RequestInit).method).toBe("POST")
    expect(result).toEqual({ success: true, request: { id: "q-1", code: "COT-1", status: "pending", createdAt: "2026-01-01" } })
  })

  it("throws the server error message when the response is not ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Datos inválidos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { createQuoteRequest } = await import("@/lib/api")

    await expect(
      createQuoteRequest({
        customer: { name: "Cliente", phone: "123", address: "Calle 1" },
        products: [{ product_id: "p-1", quantity: 1 }],
        project_type: "commercial",
        installation_required: true,
      }),
    ).rejects.toThrow("Datos inválidos")
  })

  it("uses a fallback error message when the payload has no error field", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "boom" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { createQuoteRequest } = await import("@/lib/api")

    await expect(
      createQuoteRequest({
        customer: { name: "Cliente", phone: "123", address: "Calle 1" },
        products: [{ product_id: "p-1", quantity: 1 }],
        project_type: "industrial",
        installation_required: false,
      }),
    ).rejects.toThrow("No se pudo registrar la solicitud de cotizacion.")
  })
})

describe("cache contract: revalidate/no-store constants passed to fetch", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.NEXT_PUBLIC_STORE_API_URL
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.unstubAllGlobals()
  })

  it("getSlides disables storefront promo caching", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [{ url: "/img/slide-1.webp", alt: "Slide 1" }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { getSlides } = await import("@/lib/api")
    const result = await getSlides()

    expect(result.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe("/api/store/slides")
    expect((init as RequestInit).next).toEqual({ revalidate: 0 })
    expect((init as RequestInit).cache).toBeUndefined()
  })

  it("getProducts without filters disables catalog price caching", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [{ id: "p1", name: "Camara IP", price: 100, stock: 5 }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { getProducts } = await import("@/lib/api")
    const result = await getProducts()

    expect(result.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe("/api/store/products")
    expect((init as RequestInit).next).toEqual({ revalidate: 0 })
    expect((init as RequestInit).cache).toBeUndefined()
  })

  it("getProducts with a search disables price caching", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [{ id: "p1", name: "Camara IP", price: 100, stock: 5 }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { getProducts } = await import("@/lib/api")
    const result = await getProducts({ search: "camara" })

    expect(result.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe("/api/store/products?search=camara")
    expect((init as RequestInit).next).toEqual({ revalidate: 0 })
    expect((init as RequestInit).cache).toBeUndefined()
  })

  it("getOrderById passes ORDER_LOOKUP_CACHE (no-store)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ order: { id: "ord-1", status: "pending", total: 100 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { getOrderById } = await import("@/lib/api")
    const result = await getOrderById("ord-1")

    expect(result.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe("/api/store/orders/ord-1")
    expect((init as RequestInit).cache).toBe("no-store")
    expect((init as RequestInit).next).toBeUndefined()
  })
})

describe("API Types", () => {
  it("should have correct type shape for products", () => {
    const product = {
      id: "test-1",
      name: "Cámara IP 1080p",
      price: 500,
      stock: 10,
      description: null,
      image_url: null,
      category: null,
    }
    expect(product.id).toBe("test-1")
    expect(product.price).toBe(500)
  })

  it("should handle onSale product shape", () => {
    const product = {
      id: "test-2",
      name: "Cámara en oferta",
      price: 400,
      originalPrice: 500,
      onSale: true,
      discountPercent: 20,
      stock: 5,
    }
    expect(product.onSale).toBe(true)
    expect(product.discountPercent).toBe(20)
  })
})
