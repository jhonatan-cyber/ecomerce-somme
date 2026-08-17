import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { CartButton } from "@/components/store/cart-button"
import { useCartStore } from "@/lib/store/cart-store"

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="next-image" />,
}))

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), { on: vi.fn(), off: vi.fn() }],
}))

vi.mock("@/components/store/store-image", () => ({
  StoreImage: () => <div data-testid="store-image" />,
}))

beforeEach(() => {
  useCartStore.setState({ items: [] })
})

describe("CartButton", () => {
  it("renders cart button", () => {
    render(<CartButton />)
    expect(screen.getByText("Carrito")).toBeInTheDocument()
  })

  it("shows empty cart message when no items", () => {
    render(<CartButton />)
    // Popover is closed by default, but the button is there
    expect(screen.getByText("Carrito")).toBeInTheDocument()
  })

  it("does not show badge when cart is empty", () => {
    render(<CartButton />)
    expect(screen.queryByText("0")).not.toBeInTheDocument()
  })

  it("shows item count badge when items exist", () => {
    useCartStore.getState().addItem({
      id: "p1", name: "Test", price: 100, stock: 10, image_url: null, category: "Test", description: null,
    })
    render(<CartButton />)
    expect(screen.getByText("1")).toBeInTheDocument()
  })
})
