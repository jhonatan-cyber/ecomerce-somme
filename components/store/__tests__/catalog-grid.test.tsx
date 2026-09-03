import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { CatalogGrid, CATALOG_PAGE_SIZE } from "@/components/store/catalog-grid"
import type { Product } from "@/lib/types"

const push = vi.fn()
let pageParam: string | null = null

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({
    get: (key: string) => (key === "page" ? pageParam : key === "sort" ? null : null),
    toString: () => (pageParam ? `page=${pageParam}` : ""),
  }),
}))

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

vi.mock("@/components/store/product-card", () => ({
  ProductCard: ({ product }: { product: Product }) => <div data-testid="card">{product.name}</div>,
}))

vi.mock("@/components/store/product-slider", () => ({
  ProductSlider: () => <div data-testid="slider" />,
}))

function makeProducts(n: number): Product[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`,
    name: `Producto ${i + 1}`,
    price: 100 + i,
    stock: 5,
    image_url: null,
    category: "Cámaras",
    description: null,
  }))
}

beforeEach(() => {
  push.mockClear()
  pageParam = null
})

describe("CatalogGrid pagination", () => {
  it(`renderiza solo ${CATALOG_PAGE_SIZE} tarjetas en la primera página`, () => {
    render(<CatalogGrid products={makeProducts(50)} grouped={false} />)
    expect(screen.getAllByTestId("card")).toHaveLength(CATALOG_PAGE_SIZE)
    expect(screen.getByText(/Mostrando/)).toBeInTheDocument()
  })

  it("no muestra paginación cuando todo cabe en una página", () => {
    render(<CatalogGrid products={makeProducts(10)} grouped={false} />)
    expect(screen.getAllByTestId("card")).toHaveLength(10)
    expect(screen.queryByLabelText("Paginación del catálogo")).not.toBeInTheDocument()
  })

  it("respeta ?page=2 desde la URL", () => {
    pageParam = "2"
    render(<CatalogGrid products={makeProducts(50)} grouped={false} />)
    const cards = screen.getAllByTestId("card")
    expect(cards).toHaveLength(CATALOG_PAGE_SIZE)
    expect(cards[0]).toHaveTextContent("Producto 25")
  })

  it("navega a la página 2 con ?page= preservando filtros", () => {
    render(<CatalogGrid products={makeProducts(50)} grouped={false} />)
    fireEvent.click(screen.getByLabelText("Ir a página 2"))
    expect(push).toHaveBeenCalledWith(expect.stringContaining("page=2"), { scroll: false })
  })

  it("usa basePath para paginar fuera de /catalog", () => {
    render(<CatalogGrid products={makeProducts(50)} grouped={false} basePath="/new-arrivals" />)
    fireEvent.click(screen.getByLabelText("Ir a página 2"))
    expect(push).toHaveBeenCalledWith("/new-arrivals?page=2", { scroll: false })
  })
})
