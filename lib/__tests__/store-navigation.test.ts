import { describe, it, expect } from "vitest"
import { getStoreCategoryHref, defaultStoreNavigationCategories } from "@/lib/store-navigation"

describe("getStoreCategoryHref", () => {
  it("returns category-only href", () => {
    expect(getStoreCategoryHref("camaras-ip")).toBe("/catalog?category=camaras-ip")
  })

  it("includes subcategory when provided", () => {
    expect(getStoreCategoryHref("camaras-ip", "4mp")).toBe(
      "/catalog?category=camaras-ip&subcategory=4mp"
    )
  })

  it("encodes special characters", () => {
    expect(getStoreCategoryHref("cat/1", "sub/2")).toBe(
      "/catalog?category=cat%2F1&subcategory=sub%2F2"
    )
  })
})

describe("defaultStoreNavigationCategories", () => {
  it("has at least one category", () => {
    expect(defaultStoreNavigationCategories.length).toBeGreaterThan(0)
  })

  it("each category has id and name", () => {
    for (const cat of defaultStoreNavigationCategories) {
      expect(typeof cat.id).toBe("string")
      expect(typeof cat.name).toBe("string")
      expect(cat.id.length).toBeGreaterThan(0)
      expect(cat.name.length).toBeGreaterThan(0)
    }
  })

  it("categories with subcategories have valid structure", () => {
    for (const cat of defaultStoreNavigationCategories) {
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          expect(typeof sub.id).toBe("string")
          expect(typeof sub.name).toBe("string")
        }
      }
    }
  })
})
