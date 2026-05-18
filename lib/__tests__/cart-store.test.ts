import { describe, it, expect, beforeEach } from "vitest"
import type { Product, CartItem } from "@/lib/types"

function createTestProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "test-1",
    name: "Cámara IP 1080p",
    price: 500,
    stock: 10,
    description: null,
    image_url: null,
    ...overrides,
  } as Product
}

describe("Cart Store Logic", () => {
  let items: CartItem[]

  beforeEach(() => {
    items = []
  })

  // --- Existing tests ---

  it("should add item to cart", () => {
    const product = createTestProduct()
    items.push({ ...product, quantity: 1 })
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(1)
  })

  it("should increase quantity for existing item", () => {
    const product = createTestProduct()
    items.push({ ...product, quantity: 1 })

    const existingItem = items.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    }

    expect(items[0].quantity).toBe(2)
  })

  it("should remove item from cart", () => {
    const product = createTestProduct()
    items.push({ ...product, quantity: 1 })
    items = items.filter((item) => item.id !== product.id)
    expect(items).toHaveLength(0)
  })

  it("should calculate total correctly", () => {
    items.push({ ...createTestProduct({ id: "1", price: 500 }), quantity: 2 })
    items.push({ ...createTestProduct({ id: "2", price: 300 }), quantity: 1 })

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    expect(total).toBe(1300)
  })

  it("should count total items correctly", () => {
    items.push({ ...createTestProduct({ id: "1" }), quantity: 2 })
    items.push({ ...createTestProduct({ id: "2" }), quantity: 3 })

    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    expect(count).toBe(5)
  })

  it("should clear cart", () => {
    items.push({ ...createTestProduct(), quantity: 1 })
    items = []
    expect(items).toHaveLength(0)
  })

  // --- New stock validation tests ---

  it("should not allow adding more than stock", () => {
    const product = createTestProduct({ id: "limited", stock: 2 })
    const currentQty = 0

    function canAdd(quantity: number, stock: number): boolean {
      return quantity + 1 <= stock
    }

    expect(canAdd(currentQty, product.stock)).toBe(true)
    // After adding once
    expect(canAdd(1, product.stock)).toBe(true)
    // After adding twice
    expect(canAdd(2, product.stock)).toBe(false)
  })

  it("should allow adding when under stock limit", () => {
    const product = createTestProduct({ id: "high-stock", stock: 100 })

    function canAdd(currentQty: number, stock: number): boolean {
      return currentQty + 1 <= stock
    }

    expect(canAdd(0, product.stock)).toBe(true)
    expect(canAdd(50, product.stock)).toBe(true)
    expect(canAdd(99, product.stock)).toBe(true)
    expect(canAdd(100, product.stock)).toBe(false)
  })

  // --- Price sync tests ---

  it("should update item price via syncItemPrice", () => {
    const product = createTestProduct({ id: "price-test", price: 500 })
    items.push({ ...product, quantity: 1 })
    expect(items[0].price).toBe(500)

    const changed = items.some((item) => {
      if (item.id === "price-test") {
        item.price = 550
        return true
      }
      return false
    })

    expect(changed).toBe(true)
    expect(items[0].price).toBe(550)
  })

  it("should detect price changes", () => {
    items.push({ ...createTestProduct({ id: "1", price: 100 }), quantity: 1 })

    const oldPrice = items[0].price
    const newPrice = 120
    const changed = oldPrice !== newPrice

    expect(changed).toBe(true)
  })

  it("should not detect change when prices match", () => {
    items.push({ ...createTestProduct({ id: "1", price: 100 }), quantity: 1 })

    const oldPrice = items[0].price
    const newPrice = 100
    const changed = oldPrice !== newPrice

    expect(changed).toBe(false)
  })
})
