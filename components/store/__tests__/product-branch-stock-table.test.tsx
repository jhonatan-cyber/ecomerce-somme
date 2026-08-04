import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { ProductBranchStockTable } from "@/components/store/product-branch-stock-table"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

const ORIGINAL_ENV = { ...process.env }

const sampleProduct: Product = {
  id: "p1",
  name: "Cámara IP 1080p",
  description: null,
  price: 500,
  image_url: null,
  stock: 10,
  category: "Cámaras",
}

function mockFetchLocations() {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: [{ id: "b1", name: "Sucursal Centro" }] }),
  })
}

describe("ProductBranchStockTable", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    useCartStore.setState({ items: [] })
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.unstubAllGlobals()
  })

  it("fetches branches/deposits/warehouses via buildStoreApiUrl (proxy fallback)", async () => {
    const fetchMock = mockFetchLocations()
    vi.stubGlobal("fetch", fetchMock)

    render(<ProductBranchStockTable product={sampleProduct} />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3)
    })
    const urls = fetchMock.mock.calls.map((call) => call[0])
    expect(urls).toEqual([
      "/api/store/branches",
      "/api/store/deposits",
      "/api/store/warehouses",
    ])
    // El transporte es el compartido (fetchStoreRemote): los tres fetches llevan
    // los headers ngrok/Accept y cache no-store default.
    for (const [, init] of fetchMock.mock.calls) {
      expect(init).toEqual(
        expect.objectContaining({
          cache: "no-store",
          headers: expect.objectContaining({
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          }),
        }),
      )
    }
  })

  it("respects NEXT_PUBLIC_STORE_API_URL when configured", async () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://remote.store/api/store"
    const fetchMock = mockFetchLocations()
    vi.stubGlobal("fetch", fetchMock)

    render(<ProductBranchStockTable product={sampleProduct} />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3)
    })
    const urls = fetchMock.mock.calls.map((call) => call[0])
    expect(urls).toEqual([
      "https://remote.store/api/store/branches",
      "https://remote.store/api/store/deposits",
      "https://remote.store/api/store/warehouses",
    ])
  })

  it("renders branch rows from fetched data", async () => {
    const fetchMock = mockFetchLocations()
    vi.stubGlobal("fetch", fetchMock)

    render(<ProductBranchStockTable product={sampleProduct} />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3)
    })
    expect(screen.getAllByText("Sucursal Centro").length).toBeGreaterThan(0)
  })
})
