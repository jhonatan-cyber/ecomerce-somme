import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { StoreFooter } from "@/components/store/footer"

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="next-image" />,
}))

const ORIGINAL_ENV = { ...process.env }

function mockFetchSettings(facebookUrl: string) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: { facebookUrl } }),
  })
}

describe("StoreFooter", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.unstubAllGlobals()
  })

  it("fetches settings via buildStoreApiUrl (proxy fallback /api/store)", async () => {
    const fetchMock = mockFetchSettings("https://fb.com/somme")
    vi.stubGlobal("fetch", fetchMock)

    render(<StoreFooter />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })
    expect(fetchMock.mock.calls[0][0]).toBe("/api/store/settings")
    // El fetch sale por el transporte compartido (fetchStoreRemote): no-store
    // default + headers ngrok/Accept, no un fetch hand-rolleado con cache inline.
    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        cache: "no-store",
        headers: expect.objectContaining({
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        }),
      }),
    )
  })

  it("respects NEXT_PUBLIC_STORE_API_URL when configured", async () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://remote.store/api/store"
    const fetchMock = mockFetchSettings("https://fb.com/somme")
    vi.stubGlobal("fetch", fetchMock)

    render(<StoreFooter />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })
    expect(fetchMock.mock.calls[0][0]).toBe("https://remote.store/api/store/settings")
    expect(fetchMock.mock.calls[0][0]).not.toBe("/api/store/settings")
  })

  it("renders social links from the fetched settings", async () => {
    const fetchMock = mockFetchSettings("https://fb.com/somme")
    vi.stubGlobal("fetch", fetchMock)

    render(<StoreFooter />)

    await waitFor(() => {
      expect(screen.getByLabelText("Facebook")).toHaveAttribute("href", "https://fb.com/somme")
    })
  })
})
