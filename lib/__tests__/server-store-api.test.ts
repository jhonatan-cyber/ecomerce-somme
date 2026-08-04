import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  getRemoteStoreOrdersUrl,
  getRemoteStoreProductsUrl,
  getRemoteStoreCategoriesUrl,
  getRemoteStoreBrandsUrl,
  getRemoteStoreProductDetailUrl,
} from "@/lib/server-store-api"

describe("server-store-api URL builders", () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it("getRemoteStoreOrdersUrl builds orders path", () => {
    expect(getRemoteStoreOrdersUrl()).toBe("https://api.example.com/store/orders")
  })

  it("getRemoteStoreOrdersUrl with orderId", () => {
    expect(getRemoteStoreOrdersUrl("ord-1")).toBe("https://api.example.com/store/orders/ord-1")
  })

  it("getRemoteStoreProductsUrl builds products path", () => {
    expect(getRemoteStoreProductsUrl()).toBe("https://api.example.com/store/products")
  })

  it("getRemoteStoreProductsUrl with search", () => {
    expect(getRemoteStoreProductsUrl("camera")).toBe("https://api.example.com/store/products?camera")
  })

  it("getRemoteStoreCategoriesUrl builds categories path", () => {
    expect(getRemoteStoreCategoriesUrl()).toBe("https://api.example.com/store/categories")
  })

  it("getRemoteStoreBrandsUrl builds brands path", () => {
    expect(getRemoteStoreBrandsUrl()).toBe("https://api.example.com/store/brands")
  })

  it("getRemoteStoreProductDetailUrl encodes productId", () => {
    expect(getRemoteStoreProductDetailUrl("abc/123")).toBe(
      "https://api.example.com/store/products/abc%2F123"
    )
  })

  it("uses NEXT_PUBLIC_STORE_API_URL when set", () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://custom.api/store"
    expect(getRemoteStoreOrdersUrl()).toBe("https://custom.api/store/orders")
  })

  it("does not double /store", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/store"
    expect(getRemoteStoreOrdersUrl()).toBe("https://api.example.com/store/orders")
  })

  it("throws when no env var set", () => {
    delete process.env.NEXT_PUBLIC_STORE_API_URL
    delete process.env.NEXT_PUBLIC_API_URL
    expect(() => getRemoteStoreOrdersUrl()).toThrow()
  })
})
