import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { LocalOrderManager, LOCAL_STORAGE_KEY } from "@/lib/local-orders"
import type { OrderRequest } from "@/lib/types"

const mockOrder: OrderRequest = {
  customer: { name: "Test", email: "test@test.com" },
  items: [{ productId: "p1", productName: "Cam", productPrice: 100, quantity: 1 }],
  total: 100,
}

beforeEach(() => {
  localStorage.clear()
})

describe("LocalOrderManager", () => {
  describe("saveOrder", () => {
    it("saves order and returns success", () => {
      const result = LocalOrderManager.saveOrder(mockOrder)
      expect(result.success).toBe(true)
      expect(result.orderId).toMatch(/^ORD-/)
      expect(result.message).toBeTruthy()
    })

    it("persists to localStorage", () => {
      LocalOrderManager.saveOrder(mockOrder)
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
      expect(stored).toHaveLength(1)
      expect(stored[0].status).toBe("pending")
    })

    it("generates unique IDs", () => {
      const r1 = LocalOrderManager.saveOrder(mockOrder)
      const r2 = LocalOrderManager.saveOrder(mockOrder)
      expect(r1.orderId).not.toBe(r2.orderId)
    })
  })

  describe("getStoredOrders", () => {
    it("returns empty array when nothing stored", () => {
      expect(LocalOrderManager.getStoredOrders()).toEqual([])
    })

    it("returns stored orders", () => {
      LocalOrderManager.saveOrder(mockOrder)
      const orders = LocalOrderManager.getStoredOrders()
      expect(orders).toHaveLength(1)
      expect(orders[0].status).toBe("pending")
    })
  })

  describe("getOrderStats", () => {
    it("returns zero stats for empty store", () => {
      const stats = LocalOrderManager.getOrderStats()
      expect(stats.total).toBe(0)
      expect(stats.pending).toBe(0)
      expect(stats.synced).toBe(0)
      expect(stats.error).toBe(0)
    })

    it("counts orders by status", () => {
      LocalOrderManager.saveOrder(mockOrder)
      LocalOrderManager.saveOrder(mockOrder)
      const stats = LocalOrderManager.getOrderStats()
      expect(stats.total).toBe(2)
      expect(stats.pending).toBe(2)
    })
  })

  describe("cleanupOldOrders", () => {
    it("removes old synced orders", () => {
      LocalOrderManager.saveOrder(mockOrder)
      // Read and rewrite with old date + synced status
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
      stored[0].createdAt = new Date(Date.now() - 31 * 86400000).toISOString()
      stored[0].status = "synced"
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored))

      LocalOrderManager.cleanupOldOrders()
      const remaining = LocalOrderManager.getStoredOrders()
      expect(remaining).toHaveLength(0)
    })

    it("keeps pending orders regardless of age", () => {
      LocalOrderManager.saveOrder(mockOrder)
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
      stored[0].createdAt = new Date(Date.now() - 60 * 86400000).toISOString()
      stored[0].status = "pending"
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored))

      LocalOrderManager.cleanupOldOrders()
      const remaining = LocalOrderManager.getStoredOrders()
      expect(remaining).toHaveLength(1)
    })

    it("keeps recent orders", () => {
      LocalOrderManager.saveOrder(mockOrder)
      LocalOrderManager.cleanupOldOrders()
      const remaining = LocalOrderManager.getStoredOrders()
      expect(remaining).toHaveLength(1)
    })
  })
})
