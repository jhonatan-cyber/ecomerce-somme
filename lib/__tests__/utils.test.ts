import { describe, it, expect } from "vitest"

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
  }).format(price)
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + "..."
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

describe("cn()", () => {
  it("should join class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("should filter falsy values", () => {
    expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar")
  })

  it("should return empty string for no arguments", () => {
    expect(cn()).toBe("")
  })
})

describe("formatPrice()", () => {
  it("should format integer price", () => {
    const result = formatPrice(1500)
    expect(result).toContain("1.500")
  })

  it("should format zero", () => {
    const result = formatPrice(0)
    expect(result).toContain("0")
  })
})

describe("truncate()", () => {
  it("should not truncate short strings", () => {
    expect(truncate("hello", 10)).toBe("hello")
  })

  it("should truncate long strings", () => {
    const result = truncate("hello world this is long", 10)
    expect(result.length).toBeLessThanOrEqual(13)
    expect(result).toMatch(/\.\.\.$/)
  })
})

describe("generateId()", () => {
  it("should generate unique ids", () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  it("should generate 8-character ids", () => {
    expect(generateId()).toHaveLength(8)
  })
})
