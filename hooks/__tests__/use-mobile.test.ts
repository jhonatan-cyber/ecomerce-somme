import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { useIsMobile } from "@/hooks/use-mobile"

function setWidth(width: number) {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: width })
}

beforeEach(() => {
  setWidth(1024)
  const impl = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
  // vitest 4 / jsdom reciente no provee window.matchMedia: definirlo si falta.
  if (typeof window.matchMedia === "function") {
    vi.spyOn(window, "matchMedia").mockImplementation(impl)
  } else {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn(impl),
    })
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("useIsMobile", () => {
  it("returns false for desktop width", () => {
    setWidth(1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("returns true for mobile width", () => {
    setWidth(500)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it("returns false at breakpoint boundary (768)", () => {
    setWidth(768)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("returns true just below breakpoint (767)", () => {
    setWidth(767)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })
})
