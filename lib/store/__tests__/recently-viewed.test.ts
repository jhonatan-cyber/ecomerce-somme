import { describe, it, expect, beforeEach } from "vitest"
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed"

beforeEach(() => {
  useRecentlyViewedStore.setState({ items: [] })
})

describe("recently-viewed store", () => {
  const item = (id: string) => ({
    id,
    name: `Product ${id}`,
    price: 100,
    image_url: null,
  })

  it("adds item to empty store", () => {
    useRecentlyViewedStore.getState().addItem(item("a"))
    expect(useRecentlyViewedStore.getState().items).toHaveLength(1)
    expect(useRecentlyViewedStore.getState().items[0].id).toBe("a")
  })

  it("moves existing item to front", () => {
    useRecentlyViewedStore.getState().addItem(item("a"))
    useRecentlyViewedStore.getState().addItem(item("b"))
    useRecentlyViewedStore.getState().addItem(item("a"))
    const ids = useRecentlyViewedStore.getState().items.map(i => i.id)
    expect(ids).toEqual(["a", "b"])
  })

  it("caps at 8 items", () => {
    for (let i = 0; i < 12; i++) {
      useRecentlyViewedStore.getState().addItem(item(String(i)))
    }
    expect(useRecentlyViewedStore.getState().items).toHaveLength(8)
    expect(useRecentlyViewedStore.getState().items[0].id).toBe("11")
  })

  it("clearItems empties store", () => {
    useRecentlyViewedStore.getState().addItem(item("a"))
    useRecentlyViewedStore.getState().clearItems()
    expect(useRecentlyViewedStore.getState().items).toHaveLength(0)
  })
})
