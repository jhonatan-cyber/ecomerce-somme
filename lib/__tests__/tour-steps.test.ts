import { describe, it, expect } from "vitest"
import { allTourSteps, getStepsForPage } from "@/lib/tour-steps"

describe("allTourSteps", () => {
  it("has steps for multiple pages", () => {
    const pages = new Set(allTourSteps.map(s => s.page))
    expect(pages.size).toBeGreaterThan(1)
  })

  it("each step has page, element, and popover", () => {
    for (const step of allTourSteps) {
      expect(typeof step.page).toBe("string")
      expect(typeof step.element).toBe("string")
      expect(step.popover).toBeDefined()
      expect(typeof step.popover.title).toBe("string")
      expect(typeof step.popover.description).toBe("string")
    }
  })
})

describe("getStepsForPage", () => {
  it("returns only steps for requested page", () => {
    const steps = getStepsForPage("home")
    expect(steps.length).toBeGreaterThan(0)
    for (const step of steps) {
      expect(step.element).toBeDefined()
    }
  })

  it("returns empty for unknown page", () => {
    const steps = getStepsForPage("nonexistent")
    expect(steps).toEqual([])
  })

  it("strips page property from returned steps", () => {
    const steps = getStepsForPage("home")
    for (const step of steps) {
      expect(step).not.toHaveProperty("page")
    }
  })

  it("returns steps for catalog", () => {
    const steps = getStepsForPage("catalog")
    expect(steps.length).toBeGreaterThan(0)
  })

  it("returns steps for product", () => {
    const steps = getStepsForPage("product")
    expect(steps.length).toBeGreaterThan(0)
  })

  it("returns steps for cart", () => {
    const steps = getStepsForPage("cart")
    expect(steps.length).toBeGreaterThan(0)
  })
})
