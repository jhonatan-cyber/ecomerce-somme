import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import CheckoutPage from "@/app/checkout/page"
import { useCartStore } from "@/lib/store/cart-store"
import { buildStoreApiUrl } from "@/lib/store-api-root"

const ORIGINAL_ENV = { ...process.env }

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} data-testid="next-image" />,
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
}))

// Header/footer tienen sus propios tests; aquí se mantienen como stubs para
// aislar los fetch propios del checkout.
vi.mock("@/components/store/header", () => ({
  StoreHeader: () => <div data-testid="store-header" />,
}))

vi.mock("@/components/store/footer", () => ({
  StoreFooter: () => <div data-testid="store-footer" />,
}))

// jsdom no implementa scrollIntoView ni pointer capture; Radix Select los
// invoca al abrir el dropdown y al manejar el puntero.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn(() => false)
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn()
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn()
}

const sampleCartItem = {
  id: "p1",
  name: "Cámara IP 1080p",
  description: null,
  price: 500,
  image_url: null,
  stock: 10,
  category: "Cámaras",
  quantity: 1,
}

const sampleBranch = {
  id: "b1",
  name: "Sucursal Centro",
  address: "Av. Centro 123",
  phone: null,
  email: null,
  type: "branch",
}

// Stub de fetch que enruta por URL: branches/settings/orders devuelven payloads
// con la misma forma que las rutas proxy reales.
function mockCheckoutFetch() {
  return vi.fn().mockImplementation(async (url: string) => {
    const normalized = String(url)

    if (normalized.endsWith("/branches")) {
      return {
        ok: true,
        json: async () => ({ data: [sampleBranch] }),
      }
    }

    if (normalized.endsWith("/settings")) {
      return {
        ok: true,
        json: async () => ({ data: { facebookUrl: "https://fb.com/x", checkoutQrImageUrl: null } }),
      }
    }

    if (normalized.endsWith("/orders")) {
      return {
        ok: true,
        json: async () => ({ id: "ord-123", orderCode: "ABC123" }),
      }
    }

    return { ok: true, json: async () => ({ data: [] }) }
  })
}

async function fillFormAndCreateOrder(fetchMock: ReturnType<typeof vi.fn>) {
  // Esperar a que el fetch de branches haya resuelto: los options del Select
  // solo existen cuando el state se pobló, así el helper es determinista.
  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/branches"), expect.anything())
  })

  // Nombre + teléfono (campos requeridos)
  fireEvent.change(screen.getByLabelText("Nombre completo *"), { target: { value: "Juan Pérez" } })
  fireEvent.change(screen.getByLabelText("Teléfono *"), { target: { value: "+54 11 5555 0000" } })

  // Pickup requiere sucursal: abrir el Select de Radix y elegir una opción
  const trigger = screen.getByRole("combobox")
  fireEvent.pointerDown(trigger, { pointerType: "mouse" })
  fireEvent.click(trigger)

  const option = await screen.findByRole("option", { name: "Sucursal Centro" })
  fireEvent.click(option)

  // Enviar el formulario -> abre el modal QR
  fireEvent.click(screen.getByRole("button", { name: /Confirmar pedido/ }))

  // Cerrar el flujo sin pago (solo visible en pickup) -> dispara createOrder
  const continueButton = await screen.findByRole("button", { name: /Continuar sin pagar/ })
  fireEvent.click(continueButton)

  // El flujo termina cuando createOrder devuelve un pedido y se muestra la confirmación
  await screen.findByText("Compra realizada")
}

describe("CheckoutPage", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    useCartStore.setState({ items: [sampleCartItem] })
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    useCartStore.setState({ items: [] })
    vi.unstubAllGlobals()
  })

  it("fetches branches and settings via buildStoreApiUrl in direct mode (NEXT_PUBLIC_STORE_API_URL set)", async () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://remote.store/api/store"
    const fetchMock = mockCheckoutFetch()
    vi.stubGlobal("fetch", fetchMock)

    render(<CheckoutPage />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://remote.store/api/store/branches",
        expect.anything(),
      )
    })
    expect(fetchMock).toHaveBeenCalledWith(
      "https://remote.store/api/store/settings",
      expect.anything(),
    )
    expect(fetchMock).not.toHaveBeenCalledWith("/api/store/branches", expect.anything())
  })

  it("createOrder resolves the same remote root via buildStoreApiUrl in direct mode", async () => {
    process.env.NEXT_PUBLIC_STORE_API_URL = "https://remote.store/api/store"
    const fetchMock = mockCheckoutFetch()
    vi.stubGlobal("fetch", fetchMock)

    render(<CheckoutPage />)

    await fillFormAndCreateOrder(fetchMock)

    const expectedOrdersUrl = buildStoreApiUrl("/orders")
    expect(expectedOrdersUrl).toBe("https://remote.store/api/store/orders")

    const ordersCall = fetchMock.mock.calls.find((call) => String(call[0]).endsWith("/orders"))
    expect(ordersCall).toBeDefined()
    expect(ordersCall![0]).toBe(expectedOrdersUrl)
    expect(ordersCall![1]).toMatchObject({ method: "POST" })
  })

  it("falls back to /api/store proxy in all three paths when NEXT_PUBLIC_STORE_API_URL is unset", async () => {
    const fetchMock = mockCheckoutFetch()
    vi.stubGlobal("fetch", fetchMock)

    render(<CheckoutPage />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/store/branches", expect.anything())
    })
    expect(fetchMock).toHaveBeenCalledWith("/api/store/settings", expect.anything())

    await fillFormAndCreateOrder(fetchMock)

    const ordersCall = fetchMock.mock.calls.find((call) => String(call[0]).endsWith("/orders"))
    expect(ordersCall).toBeDefined()
    expect(ordersCall![0]).toBe("/api/store/orders")
    expect(ordersCall![1]).toMatchObject({ method: "POST" })
  })
})
