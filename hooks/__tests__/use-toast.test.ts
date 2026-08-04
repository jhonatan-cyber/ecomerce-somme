import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { reducer, toast } from "@/hooks/use-toast"

// The reducer and toast function from use-toast.ts

describe("toast reducer", () => {
  const baseState = { toasts: [] as any[] }

  it("ADD_TOAST adds toast at front", () => {
    const state = reducer(baseState, {
      type: "ADD_TOAST",
      toast: { id: "1", title: "Hello", open: true },
    })
    expect(state.toasts).toHaveLength(1)
    expect(state.toasts[0].id).toBe("1")
  })

  it("ADD_TOAST limits to TOAST_LIMIT (1)", () => {
    let state = reducer(baseState, {
      type: "ADD_TOAST",
      toast: { id: "1", title: "First", open: true },
    })
    state = reducer(state, {
      type: "ADD_TOAST",
      toast: { id: "2", title: "Second", open: true },
    })
    expect(state.toasts).toHaveLength(1)
    expect(state.toasts[0].id).toBe("2")
  })

  it("UPDATE_TOAST merges toast properties", () => {
    let state = reducer(baseState, {
      type: "ADD_TOAST",
      toast: { id: "1", title: "Old", open: true },
    })
    state = reducer(state, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "New" },
    })
    expect(state.toasts[0].title).toBe("New")
  })

  it("DISMISS_TOAST sets open to false", () => {
    let state = reducer(baseState, {
      type: "ADD_TOAST",
      toast: { id: "1", title: "Hello", open: true },
    })
    state = reducer(state, { type: "DISMISS_TOAST", toastId: "1" })
    expect(state.toasts[0].open).toBe(false)
  })

  it("REMOVE_TOAST removes specific toast", () => {
    let state = reducer(baseState, {
      type: "ADD_TOAST",
      toast: { id: "1", title: "Hello", open: true },
    })
    state = reducer(state, { type: "REMOVE_TOAST", toastId: "1" })
    expect(state.toasts).toHaveLength(0)
  })

  it("REMOVE_TOAST without toastId removes all", () => {
    let state = reducer(baseState, {
      type: "ADD_TOAST",
      toast: { id: "1", title: "A", open: true },
    })
    state = reducer(state, { type: "REMOVE_TOAST" })
    expect(state.toasts).toHaveLength(0)
  })
})

describe("toast function", () => {
  it("returns id, dismiss, and update", () => {
    const result = toast({ title: "Test" } as any)
    expect(typeof result.id).toBe("string")
    expect(typeof result.dismiss).toBe("function")
    expect(typeof result.update).toBe("function")
  })
})
