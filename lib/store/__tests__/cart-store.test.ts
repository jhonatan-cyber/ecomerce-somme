import { describe, it, expect, beforeEach } from "vitest"
import { useCartStore } from "@/lib/store/cart-store"
import type { Product } from "@/lib/types"

const makeProduct = (overrides: Partial<Product> = {}): Product => {
  const base: Product = {
    id: "p1",
    name: "Cámara IP",
    price: 100,
    stock: 10,
    image_url: null,
    category: "Cámaras",
    description: null,
  }
  // Fijar `description` tras el spread para mantener el tipo requerido
  // (`Partial<Product>` reintroduce `undefined` en el campo opcional).
  return { ...base, ...overrides, description: overrides.description ?? base.description }
}

beforeEach(() => {
  useCartStore.setState({ items: [] })
})

describe("cart-store", () => {
  describe("addItem", () => {
    it("adds a new item with quantity 1", () => {
      const product = makeProduct()
      useCartStore.getState().addItem(product)
      expect(useCartStore.getState().items).toHaveLength(1)
      expect(useCartStore.getState().items[0]!.quantity).toBe(1)
    })

    it("increments quantity for existing item", () => {
      const product = makeProduct()
      useCartStore.getState().addItem(product)
      useCartStore.getState().addItem(product)
      expect(useCartStore.getState().items).toHaveLength(1)
      expect(useCartStore.getState().items[0]!.quantity).toBe(2)
    })

    it("rejects when quantity exceeds stock", () => {
      const product = makeProduct({ stock: 2 })
      useCartStore.getState().addItem(product)
      useCartStore.getState().addItem(product)
      expect(useCartStore.getState().items[0]!.quantity).toBe(2)
      const added = useCartStore.getState().addItem(product)
      expect(added).toBe(false)
      expect(useCartStore.getState().items[0]!.quantity).toBe(2)
    })
  })

  describe("removeItem", () => {
    it("removes item by id", () => {
      useCartStore.getState().addItem(makeProduct({ id: "a" }))
      useCartStore.getState().addItem(makeProduct({ id: "b" }))
      useCartStore.getState().removeItem("a")
      expect(useCartStore.getState().items).toHaveLength(1)
      expect(useCartStore.getState().items[0]!.id).toBe("b")
    })
  })

  describe("updateQuantity", () => {
    it("updates quantity", () => {
      useCartStore.getState().addItem(makeProduct())
      useCartStore.getState().updateQuantity("p1", 5)
      expect(useCartStore.getState().items[0]!.quantity).toBe(5)
    })

    it("removes item when quantity <= 0", () => {
      useCartStore.getState().addItem(makeProduct())
      useCartStore.getState().updateQuantity("p1", 0)
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it("clamps quantity to the available stock", () => {
      useCartStore.getState().addItem(makeProduct({ stock: 2 }))
      useCartStore.getState().updateQuantity("p1", 99)
      expect(useCartStore.getState().items[0]!.quantity).toBe(2)
    })
  })

  describe("getTotal", () => {
    it("calculates total correctly", () => {
      useCartStore.getState().addItem(makeProduct({ id: "a", price: 100 }))
      useCartStore.getState().addItem(makeProduct({ id: "b", price: 250 }))
      useCartStore.getState().updateQuantity("a", 2)
      useCartStore.getState().updateQuantity("b", 1)
      expect(useCartStore.getState().getTotal()).toBe(450)
    })
  })

  describe("getItemCount", () => {
    it("counts total items", () => {
      useCartStore.getState().addItem(makeProduct({ id: "a" }))
      useCartStore.getState().addItem(makeProduct({ id: "b" }))
      useCartStore.getState().updateQuantity("a", 3)
      expect(useCartStore.getState().getItemCount()).toBe(4)
    })
  })

  describe("clearCart", () => {
    it("empties cart", () => {
      useCartStore.getState().addItem(makeProduct())
      useCartStore.getState().clearCart()
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe("syncItemPrice", () => {
    it("updates price when different", () => {
      useCartStore.getState().addItem(makeProduct())
      const changed = useCartStore.getState().syncItemPrice("p1", 200)
      expect(changed).toBe(true)
      expect(useCartStore.getState().items[0]!.price).toBe(200)
    })

    it("returns false when price unchanged", () => {
      useCartStore.getState().addItem(makeProduct())
      const changed = useCartStore.getState().syncItemPrice("p1", 100)
      expect(changed).toBe(false)
    })

    it("returns false for nonexistent item", () => {
      const changed = useCartStore.getState().syncItemPrice("nope", 100)
      expect(changed).toBe(false)
    })
  })
})
