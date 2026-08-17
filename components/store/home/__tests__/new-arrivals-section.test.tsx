import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { NewArrivalsSection } from "@/components/store/home/new-arrivals-section"
import type { Product } from "@/lib/types"

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="next-image" />,
}))

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), { on: vi.fn(), off: vi.fn(), selectedScrollSnap: vi.fn(() => 0), canScrollNext: vi.fn(() => false), scrollTo: vi.fn(), scrollNext: vi.fn(), scrollPrev: vi.fn() }],
}))

vi.mock("@/components/store/product-card-actions", () => ({
  ProductCardActions: () => <button>Agregar</button>,
}))

vi.mock("@/components/store/product-card-image", () => ({
  ProductCardImage: () => <div />,
}))

const makeProduct = (id: string, createdAt?: string): Product => ({
  id,
  name: `Product ${id}`,
  price: 100,
  stock: 5,
  image_url: null,
  category: "Test",
  description: null,
  createdAt,
})

describe("NewArrivalsSection", () => {
  it("returns null when products is empty", () => {
    const { container } = render(<NewArrivalsSection products={[]} />)
    expect(container.innerHTML).toBe("")
  })

  it("renders section with products", () => {
    render(
      <NewArrivalsSection
        products={[
          makeProduct("1", "2025-01-01"),
          makeProduct("2", "2025-02-01"),
        ]}
      />,
    )
    expect(screen.getByText("Novedades")).toBeInTheDocument()
    // Component renders both desktop and mobile views, so each product appears twice
    expect(screen.getAllByText("Product 1").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Product 2").length).toBeGreaterThanOrEqual(1)
  })

  it("sorts by newest first", () => {
    render(
      <NewArrivalsSection
        products={[
          makeProduct("old", "2024-01-01"),
          makeProduct("new", "2025-06-01"),
        ]}
      />,
    )
    const items = screen.getAllByText(/Product/)
    // "new" should appear before "old" in the DOM (desktop view first)
    const newTexts = items.map((el) => el.textContent)
    const newIdx = newTexts.findIndex((t) => t === "Product new")
    const oldIdx = newTexts.findIndex((t) => t === "Product old")
    expect(newIdx).toBeLessThan(oldIdx)
  })

  it("limits to 6 products", () => {
    const products = Array.from({ length: 10 }, (_, i) =>
      makeProduct(String(i), `2025-01-${String(i + 1).padStart(2, "0")}`),
    )
    render(<NewArrivalsSection products={products} />)
    // 6 products × 2 views (desktop + mobile) = 12 total
    const productNames = screen.getAllByText(/Product/)
    expect(productNames).toHaveLength(12)
  })
})
