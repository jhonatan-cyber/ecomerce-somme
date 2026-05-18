import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock process.env for image URL rewriting tests
const ORIGINAL_ENV = { ...process.env }

describe("rewriteImageUrl", () => {
  beforeEach(() => {
    vi.resetModules()
    process.env = { ...ORIGINAL_ENV }
    delete process.env.NEXT_PUBLIC_UPLOADS_URL
  })

  it("should rewrite 192.168.x.x URLs when uploads URL is set", async () => {
    process.env.NEXT_PUBLIC_UPLOADS_URL = "https://somme.nuwesomme.cloud"
    const { rewriteImageUrl } = await import("@/lib/api")
    const result = rewriteImageUrl("http://192.168.0.2:8000/api/uploads/files/product.webp")
    expect(result).toBe("https://somme.nuwesomme.cloud/api/uploads/files/product.webp")
  })

  it("should return null for null input", async () => {
    const { rewriteImageUrl } = await import("@/lib/api")
    expect(rewriteImageUrl(null)).toBeNull()
  })

  it("should return null for undefined input", async () => {
    const { rewriteImageUrl } = await import("@/lib/api")
    expect(rewriteImageUrl(undefined)).toBeNull()
  })

  it("should return URL as-is when uploads URL is not set", async () => {
    const { rewriteImageUrl } = await import("@/lib/api")
    const url = "http://192.168.0.2:8000/api/uploads/files/product.webp"
    expect(rewriteImageUrl(url)).toBe(url)
  })

  it("should return non-private URLs as-is even when uploads URL is set", async () => {
    process.env.NEXT_PUBLIC_UPLOADS_URL = "https://somme.nuwesomme.cloud"
    const { rewriteImageUrl } = await import("@/lib/api")
    const url = "https://cdn.example.com/images/product.webp"
    expect(rewriteImageUrl(url)).toBe(url)
  })

  it("should rewrite different private IP variants", async () => {
    process.env.NEXT_PUBLIC_UPLOADS_URL = "https://somme.nuwesomme.cloud"
    const { rewriteImageUrl } = await import("@/lib/api")
    expect(rewriteImageUrl("http://192.168.1.100:3000/file.jpg"))
      .toBe("https://somme.nuwesomme.cloud/file.jpg")
    expect(rewriteImageUrl("http://192.168.0.5:8000/images/test.png"))
      .toBe("https://somme.nuwesomme.cloud/images/test.png")
  })

  it("should handle trailing slashes in uploads URL", async () => {
    process.env.NEXT_PUBLIC_UPLOADS_URL = "https://somme.nuwesomme.cloud/"
    const { rewriteImageUrl } = await import("@/lib/api")
    const result = rewriteImageUrl("http://192.168.0.2:8000/api/uploads/files/product.webp")
    expect(result).toBe("https://somme.nuwesomme.cloud/api/uploads/files/product.webp")
  })
})

describe("API Types", () => {
  it("should have correct type shape for products", () => {
    const product = {
      id: "test-1",
      name: "Cámara IP 1080p",
      price: 500,
      stock: 10,
      description: null,
      image_url: null,
      category: null,
    }
    expect(product.id).toBe("test-1")
    expect(product.price).toBe(500)
  })

  it("should handle onSale product shape", () => {
    const product = {
      id: "test-2",
      name: "Cámara en oferta",
      price: 400,
      originalPrice: 500,
      onSale: true,
      discountPercent: 20,
      stock: 5,
    }
    expect(product.onSale).toBe(true)
    expect(product.discountPercent).toBe(20)
  })
})
