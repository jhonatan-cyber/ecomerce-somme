import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { BrandsCarousel } from "@/components/store/home/brands-carousel"

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="next-image" />,
}))

const brands = [
  { id: "b1", name: "Hikvision", logo: "/img/hik.png" },
  { id: "b2", name: "Dahua", logo: "/img/dahua.png" },
  { id: "b3", name: "NoLogo", logo: null },
]

describe("BrandsCarousel", () => {
  it("returns null when no brands have logos", () => {
    const { container } = render(
      <BrandsCarousel brands={[{ id: "b1", name: "Test", logo: null }]} />,
    )
    expect(container.innerHTML).toBe("")
  })

  it("renders brands with logos", () => {
    render(<BrandsCarousel brands={brands} />)
    expect(screen.getByText("Marcas disponibles")).toBeInTheDocument()
    const images = screen.getAllByTestId("next-image")
    // 2 brands with logos, duplicated for marquee = 4 images
    expect(images.length).toBe(4)
  })

  it("filters out brands without logos", () => {
    render(<BrandsCarousel brands={brands} />)
    const links = screen.getAllByRole("link")
    // 2 brands with logos, duplicated = 4 links
    expect(links.length).toBe(4)
    expect(links.every((l) => l.getAttribute("href")?.includes("brand="))).toBe(true)
  })

  it("links each brand to catalog with brand filter", () => {
    render(<BrandsCarousel brands={brands} />)
    const links = screen.getAllByRole("link")
    expect(links[0]!.getAttribute("href")).toBe("/catalog?brand=b1")
    expect(links[1]!.getAttribute("href")).toBe("/catalog?brand=b2")
  })
})
