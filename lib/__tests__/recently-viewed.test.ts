import { describe, it, expect, beforeEach } from "vitest"

interface RecentlyViewedItem {
  id: string
  name: string
  price: number
  image_url: string | null
}

describe("Recently Viewed Logic", () => {
  let items: RecentlyViewedItem[]
  const MAX_ITEMS = 8

  beforeEach(() => {
    items = []
  })

  function addItem(item: RecentlyViewedItem) {
    const filtered = items.filter((i) => i.id !== item.id)
    items = [item, ...filtered].slice(0, MAX_ITEMS)
  }

  it("should add item to recently viewed", () => {
    addItem({ id: "1", name: "Producto 1", price: 100, image_url: null })
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe("1")
  })

  it("should move duplicate to top", () => {
    addItem({ id: "1", name: "Producto 1", price: 100, image_url: null })
    addItem({ id: "2", name: "Producto 2", price: 200, image_url: null })
    addItem({ id: "1", name: "Producto 1", price: 100, image_url: null })

    expect(items).toHaveLength(2)
    expect(items[0].id).toBe("1")
    expect(items[1].id).toBe("2")
  })

  it("should not exceed MAX_ITEMS", () => {
    for (let i = 0; i < 10; i++) {
      addItem({
        id: `item-${i}`,
        name: `Producto ${i}`,
        price: i * 100,
        image_url: null,
      })
    }
    expect(items.length).toBeLessThanOrEqual(8)
    expect(items[0].id).toBe("item-9")
    expect(items[7].id).toBe("item-2")
  })

  it("should clear all items", () => {
    addItem({ id: "1", name: "Producto 1", price: 100, image_url: null })
    addItem({ id: "2", name: "Producto 2", price: 200, image_url: null })
    items = []
    expect(items).toHaveLength(0)
  })

  it("should handle empty state", () => {
    expect(items).toHaveLength(0)
  })
})
