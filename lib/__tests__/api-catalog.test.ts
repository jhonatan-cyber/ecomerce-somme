import { describe, it, expect, vi, afterEach } from "vitest"
import {
  getProducts,
  getProductById,
  getCategories,
  getBrands,
  getOnSaleProducts,
  getAds,
} from "@/lib/api"

function rawProduct(overrides: Record<string, unknown> = {}) {
  return { id: "p1", name: "Cámara IP 4MP", price: 500, stock: 10, ...overrides }
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("getProducts", () => {
  it("devuelve ok con productos normalizados", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ products: [rawProduct()] })))
    const result = await getProducts()
    expect(result.ok).toBe(true)
    expect(result.products).toHaveLength(1)
    expect(result.products[0]!.id).toBe("p1")
    expect(result.products[0]!.price).toBe(500)
  })

  it("usa installerPrice sin multiplicarlo", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ data: [rawProduct({ price: 36, installerPrice: 30, stock: 108 })] })))
    const result = await getProducts()
    expect(result.products[0]!.price).toBe(30)
  })

  it("propaga search/categoryId/brandId/limit a la URL", async () => {
    // Respuesta fresca por llamada: el fallback de brandId refetchea y un
    // mismo objeto Response solo permite leer el body una vez.
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(jsonResponse({ data: [] })))
    vi.stubGlobal("fetch", fetchMock)
    await getProducts({ search: "camara", categoryId: "c1", brandId: "b1", limit: 24 })
    const url = String(fetchMock.mock.calls[0]![0])
    expect(url).toContain("search=camara")
    expect(url).toContain("categoryId=c1")
    expect(url).toContain("brandId=b1")
    expect(url).toContain("limit=24")
  })

  it("acepta la forma { data } como colección", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ data: [rawProduct({ id: "p2" })] })))
    const result = await getProducts()
    expect(result.ok).toBe(true)
    expect(result.products[0]!.id).toBe("p2")
  })

  it("descarta registros incompletos y falla si no queda ninguno", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ products: [{ name: "sin id" }] })))
    const result = await getProducts()
    expect(result.ok).toBe(false)
    expect(result.products).toEqual([])
  })

  it("devuelve ok:false ante HTTP no-ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ error: "x" }, 500)))
    const result = await getProducts()
    expect(result.ok).toBe(false)
    expect(result.status).toBe(500)
  })

  it("devuelve ok:false ante error de red", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")))
    const result = await getProducts()
    expect(result.ok).toBe(false)
    expect(result.products).toEqual([])
  })
})

describe("getProductById", () => {
  it("devuelve el detalle directo cuando el upstream responde", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ product: rawProduct({ id: "p9" }) })))
    const result = await getProductById("p9")
    expect(result.ok).toBe(true)
    expect(result.product?.id).toBe("p9")
  })

  it("usa el catálogo como fallback cuando el detalle falla", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ error: "nf" }, 404))
      .mockResolvedValueOnce(jsonResponse({ products: [rawProduct({ id: "p5" })] }))
    vi.stubGlobal("fetch", fetchMock)
    const result = await getProductById("p5")
    expect(result.ok).toBe(true)
    expect(result.product?.id).toBe("p5")
  })

  it("devuelve ok:false si no existe en ningún lado", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ error: "nf" }, 404))
      .mockResolvedValueOnce(jsonResponse({ products: [rawProduct({ id: "otro" })] }))
    vi.stubGlobal("fetch", fetchMock)
    const result = await getProductById("inexistente")
    expect(result.ok).toBe(false)
  })
})

describe("getCategories / getBrands", () => {
  it("normaliza categorías", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ data: [{ id: "c1", name: "Cámaras" }] })))
    const result = await getCategories()
    expect(result.ok).toBe(true)
    expect(result.categories[0]!.name).toBe("Cámaras")
  })

  it("normaliza marcas", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ brands: [{ id: "b1", name: "Dahua" }] })))
    const result = await getBrands()
    expect(result.ok).toBe(true)
    expect(result.brands[0]!.id).toBe("b1")
  })

  it("categorías vacías cuando el upstream falla", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")))
    const result = await getCategories()
    expect(result.ok).toBe(false)
    expect(result.categories).toEqual([])
  })
})

describe("getOnSaleProducts / getAds", () => {
  it("filtra productos en oferta", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ products: [rawProduct({ onSale: true })] })),
    )
    const result = await getOnSaleProducts()
    expect(result.ok).toBe(true)
    expect(result.products[0]!.onSale).toBe(true)
  })

  it("devuelve ads del storefront", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ data: [{ url: "/a.webp", alt: "Promo" }] })),
    )
    const result = await getAds()
    expect(result.ads).toHaveLength(1)
  })
})
