import { describe, it, expect, beforeEach } from "vitest"
import { useComparisonStore } from "@/lib/store/comparison-store"

beforeEach(() => {
  useComparisonStore.setState({
    selectedProducts: [],
    selectedSpecs: ["resolution", "night_vision", "weather_resistance", "price"],
    isComparisonMode: false,
  })
})

describe("comparison-store", () => {
  describe("toggleProduct", () => {
    it("adds product and enables comparison mode", () => {
      useComparisonStore.getState().toggleProduct("p1")
      expect(useComparisonStore.getState().selectedProducts).toContain("p1")
      expect(useComparisonStore.getState().isComparisonMode).toBe(true)
    })

    it("removes product and disables mode when empty", () => {
      useComparisonStore.getState().toggleProduct("p1")
      useComparisonStore.getState().toggleProduct("p1")
      expect(useComparisonStore.getState().selectedProducts).not.toContain("p1")
      expect(useComparisonStore.getState().isComparisonMode).toBe(false)
    })
  })

  describe("removeProduct", () => {
    it("removes specific product", () => {
      useComparisonStore.getState().toggleProduct("p1")
      useComparisonStore.getState().toggleProduct("p2")
      useComparisonStore.getState().removeProduct("p1")
      expect(useComparisonStore.getState().selectedProducts).toEqual(["p2"])
    })
  })

  describe("clearComparison", () => {
    it("resets everything", () => {
      useComparisonStore.getState().toggleProduct("p1")
      useComparisonStore.getState().clearComparison()
      expect(useComparisonStore.getState().selectedProducts).toEqual([])
      expect(useComparisonStore.getState().isComparisonMode).toBe(false)
      expect(useComparisonStore.getState().selectedSpecs).toEqual([
        "resolution", "night_vision", "weather_resistance", "price",
      ])
    })
  })

  describe("toggleSpec", () => {
    it("removes spec from defaults", () => {
      useComparisonStore.getState().toggleSpec("resolution")
      expect(useComparisonStore.getState().selectedSpecs).not.toContain("resolution")
    })

    it("adds a new spec", () => {
      useComparisonStore.getState().toggleSpec("storage_capacity")
      expect(useComparisonStore.getState().selectedSpecs).toContain("storage_capacity")
    })
  })

  describe("getComparison", () => {
    it("returns matching products", () => {
      useComparisonStore.getState().toggleProduct("p1")
      useComparisonStore.getState().toggleProduct("p2")
      const result = useComparisonStore.getState().getComparison([
        { id: "p1", name: "A" } as any,
        { id: "p2", name: "B" } as any,
        { id: "p3", name: "C" } as any,
      ])
      expect(result.products).toHaveLength(2)
      expect(result.products.map(p => p.id)).toEqual(["p1", "p2"])
    })
  })
})
