import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { ProductCard } from "@/components/store/product-card"
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
  ProductCardActions: ({ product }: { product: Product }) => (
    <button data-testid="add-to-cart">Agregar</button>
  ),
}))

vi.mock("@/components/store/product-card-image", () => ({
  ProductCardImage: () => <div data-testid="product-image" />,
}))

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "p1",
  name: "Cámara IP 4MP",
  price: 500,
  stock: 10,
  image_url: "/img/cam.jpg",
  category: "Cámaras",
  ...overrides,
})

describe("ProductCard", () => {
  it("renders product name", () => {
    render(<ProductCard product={makeProduct()} />)
    expect(screen.getByText("Cámara IP 4MP")).toBeInTheDocument()
  })

  it("renders formatted price", () => {
    render(<ProductCard product={makeProduct({ price: 1500 })} />)
    expect(screen.getByText(/BOB 1\.500/)).toBeInTheDocument()
  })

  it("renders sale price with original price", () => {
    render(
      <ProductCard
        product={makeProduct({
          onSale: true,
          price: 400,
          originalPrice: 500,
          discountPercent: 20,
        })}
      />,
    )
    expect(screen.getByText(/Ahora/)).toBeInTheDocument()
    expect(screen.getByText(/Antes/)).toBeInTheDocument()
  })

  it("shows 'Sin stock' when stock is 0", () => {
    render(<ProductCard product={makeProduct({ stock: 0 })} />)
    expect(screen.getByText("Sin stock")).toBeInTheDocument()
  })

  it("shows stock count when in stock", () => {
    render(<ProductCard product={makeProduct({ stock: 5 })} />)
    expect(screen.getByText("5 en stock")).toBeInTheDocument()
  })

  it("renders category", () => {
    render(<ProductCard product={makeProduct({ category: "NVR" })} />)
    expect(screen.getByText("NVR")).toBeInTheDocument()
  })

  it("hides brand when showBrand is false", () => {
    render(
      <ProductCard
        product={makeProduct({ brand: "Hikvision" })}
        showBrand={false}
      />,
    )
    expect(screen.queryByText("Hikvision")).not.toBeInTheDocument()
  })

  it("renders add to cart button", () => {
    render(<ProductCard product={makeProduct()} />)
    expect(screen.getByTestId("add-to-cart")).toBeInTheDocument()
  })

  it("links to product detail page", () => {
    render(<ProductCard product={makeProduct({ id: "cam-123" })} />)
    const links = screen.getAllByRole("link")
    const productLink = links.find((l) => l.getAttribute("href")?.includes("/product/cam-123"))
    expect(productLink).toBeTruthy()
  })
})
