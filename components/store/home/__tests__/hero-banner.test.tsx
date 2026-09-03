import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { HeroBanner } from "@/components/store/home/hero-banner"

const slides = [
  { url: "https://cdn.example.com/1.webp", alt: "Uno" },
  { url: "https://cdn.example.com/2.webp", alt: "Dos" },
]

describe("HeroBanner", () => {
  it("no renderiza nada sin slides", () => {
    const { container } = render(<HeroBanner slides={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("oculta el slide roto en vez de mostrar icono roto", () => {
    render(<HeroBanner slides={slides} />)
    const imgs = screen.getAllByRole("img")
    expect(imgs).toHaveLength(2)
    fireEvent.error(imgs[0]!)
    expect(screen.getAllByRole("img")).toHaveLength(1)
    expect(screen.getByAltText("Dos")).toBeInTheDocument()
  })

  it("colapsa a null cuando todos los archivos fallan (backend sin uploads)", () => {
    const { container } = render(<HeroBanner slides={slides} />)
    screen.getAllByRole("img").forEach((img) => fireEvent.error(img))
    expect(container).toBeEmptyDOMElement()
  })
})
