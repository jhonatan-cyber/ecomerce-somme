import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { consumeRateLimit, getClientIpFromRequest } from "@/lib/server/rate-limit"

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
})

describe("consumeRateLimit", () => {
  it("allows requests within limit", () => {
    const result = consumeRateLimit({ key: "test1", windowMs: 1000, maxAttempts: 3, blockMs: 5000 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it("blocks after exceeding maxAttempts", () => {
    consumeRateLimit({ key: "test2", windowMs: 1000, maxAttempts: 2, blockMs: 5000 })
    consumeRateLimit({ key: "test2", windowMs: 1000, maxAttempts: 2, blockMs: 5000 })
    const result = consumeRateLimit({ key: "test2", windowMs: 1000, maxAttempts: 2, blockMs: 5000 })
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it("resets after window expires", () => {
    consumeRateLimit({ key: "test3", windowMs: 1000, maxAttempts: 2, blockMs: 5000 })
    consumeRateLimit({ key: "test3", windowMs: 1000, maxAttempts: 2, blockMs: 5000 })
    vi.advanceTimersByTime(1001)
    const result = consumeRateLimit({ key: "test3", windowMs: 1000, maxAttempts: 2, blockMs: 5000 })
    expect(result.allowed).toBe(true)
  })

  it("different keys are independent", () => {
    consumeRateLimit({ key: "a", windowMs: 1000, maxAttempts: 1, blockMs: 5000 })
    consumeRateLimit({ key: "a", windowMs: 1000, maxAttempts: 1, blockMs: 5000 })
    const result = consumeRateLimit({ key: "b", windowMs: 1000, maxAttempts: 1, blockMs: 5000 })
    expect(result.allowed).toBe(true)
  })
})

describe("getClientIpFromRequest", () => {
  it("extracts first IP from x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" })
    expect(getClientIpFromRequest(headers)).toBe("1.2.3.4")
  })

  it("falls back to x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "9.8.7.6" })
    expect(getClientIpFromRequest(headers)).toBe("9.8.7.6")
  })

  it("returns unknown when no headers present", () => {
    const headers = new Headers()
    expect(getClientIpFromRequest(headers)).toBe("unknown")
  })
})
