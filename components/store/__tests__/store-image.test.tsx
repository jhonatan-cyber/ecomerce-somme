import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { StoreImage } from "@/components/store/store-image"

vi.mock("next/image", () => ({
  default: (props: any) => {
    const { onLoad, onError, ...rest } = props
    return <img {...rest} onLoad={onLoad} onError={onError} data-testid="next-image" />
  },
}))

describe("StoreImage", () => {
  it("shows fallback when src is null", () => {
    render(<StoreImage src={null} alt="test" />)
    expect(screen.getByText("Sin imagen")).toBeInTheDocument()
  })

  it("shows fallback when src is undefined", () => {
    render(<StoreImage src={undefined} alt="test" />)
    expect(screen.getByText("Sin imagen")).toBeInTheDocument()
  })

  it("shows custom fallback text", () => {
    render(<StoreImage src={null} alt="test" fallbackText="No disponible" />)
    expect(screen.getByText("No disponible")).toBeInTheDocument()
  })

  it("renders image when src is provided", () => {
    render(<StoreImage src="/test.jpg" alt="test product" />)
    expect(screen.getByTestId("next-image")).toBeInTheDocument()
    expect(screen.getByTestId("next-image")).toHaveAttribute("src", "/test.jpg")
  })

  it("hides fallback icon when showFallbackIcon is false", () => {
    const { container } = render(
      <StoreImage src={null} alt="test" showFallbackIcon={false} />,
    )
    expect(container.querySelector("svg")).toBeNull()
  })

  it("calls onImageError and shows fallback when image errors", async () => {
    const onError = vi.fn()
    render(<StoreImage src="/bad.jpg" alt="test" onImageError={onError} />)
    const img = screen.getByTestId("next-image")
    fireEvent.error(img)
    await waitFor(() => {
      expect(screen.getByText("Sin imagen")).toBeInTheDocument()
    })
    expect(onError).toHaveBeenCalled()
  })
})
