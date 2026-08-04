import { describe, it, expect } from "vitest"
import { cn, formatPrice, buildFallbackCategories } from "@/lib/utils"

describe("cn()", () => {
  it("joins class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("filters falsy values", () => {
    expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar")
  })

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("")
  })

  it("merges tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })
})

describe("formatPrice()", () => {
  it("formats integer price with BOB prefix", () => {
    const result = formatPrice(1500)
    expect(result).toBe("BOB 1.500")
  })

  it("formats zero", () => {
    const result = formatPrice(0)
    expect(result).toBe("BOB 0")
  })

  it("formats large numbers with thousands separator", () => {
    const result = formatPrice(1500000)
    expect(result).toBe("BOB 1.500.000")
  })
})

describe("buildFallbackCategories()", () => {
  it("returns empty array for empty input", () => {
    expect(buildFallbackCategories([])).toEqual([])
  })

  it("builds categories from products", () => {
    const products = [
      { category: "Cámaras" },
      { category: "NVR" },
      { category: "Cámaras" },
    ]
    const cats = buildFallbackCategories(products)
    expect(cats).toHaveLength(2)
    expect(cats[0].name).toBe("Cámaras")
    expect(cats[1].name).toBe("NVR")
  })

  it("generates slug id from name", () => {
    const cats = buildFallbackCategories([{ category: "Cámaras IP" }])
    expect(cats[0].id).toBe("cámaras-ip")
  })

  it("filters null/undefined/empty categories", () => {
    const cats = buildFallbackCategories([
      { category: null },
      { category: undefined },
      { category: "" },
      { category: "  " },
      { category: "OK" },
    ])
    expect(cats).toHaveLength(1)
  })
})
