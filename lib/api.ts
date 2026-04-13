import type {
  CatalogLoadResult,
  Category,
  CategoryLoadResult,
  OrderLookupResult,
  OrderRequest,
  OrderResponse,
  ProductDetailLoadResult,
  Product,
  StoreOrder,
  StoreOrderCustomer,
  StoreOrderItem,
} from "./types"

const STORE_API_ROOT =
  process.env.NEXT_PUBLIC_STORE_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "/api/store"

function joinApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const normalizedRoot = STORE_API_ROOT.replace(/\/$/, "")

  if (normalizedRoot.startsWith("http://") || normalizedRoot.startsWith("https://")) {
    return new URL(normalizedPath.slice(1), `${normalizedRoot}/`).toString()
  }

  return `${normalizedRoot}${normalizedPath}`
}

function toText(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (normalized === "true") return true
    if (normalized === "false") return false
  }

  return undefined
}

function toTextArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined

  const values = value.map((item) => toText(item)).filter((item): item is string => item !== null)
  return values.length > 0 ? values : undefined
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function extractCollection(payload: unknown, keys: string[]): unknown[] | null {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!isPlainObject(payload)) {
    return null
  }

  const record = payload as Record<string, unknown>

  for (const key of keys) {
    const value = record[key]
    if (Array.isArray(value)) {
      return value
    }
  }

  return null
}

function extractRecord(payload: unknown, keys: string[]): Record<string, unknown> | null {
  if (!isPlainObject(payload)) {
    return null
  }

  for (const key of keys) {
    const value = payload[key]
    if (isPlainObject(value)) {
      return value
    }
  }

  return payload
}

function getCategory(value: unknown): string | null {
  if (typeof value === "string") {
    return toText(value)
  }

  if (value && typeof value === "object") {
    const category = value as Record<string, unknown>
    return toText(category.name ?? category.label ?? category.title)
  }

  return null
}

function normalizeProductRecord(rawProduct: unknown): Product | null {
  if (!isPlainObject(rawProduct)) {
    return null
  }

  const id = toText(rawProduct.id ?? rawProduct.code ?? rawProduct.product_id ?? rawProduct.productId)
  const name = toText(rawProduct.name ?? rawProduct.title)
  const price = toNumber(rawProduct.price ?? rawProduct.salePrice ?? rawProduct.sale_price)
  const stock = toNumber(rawProduct.stock ?? rawProduct.availableStock ?? rawProduct.available_stock)

  if (!id || !name || price === null || stock === null) {
    return null
  }

  return {
    id,
    name,
    description: toText(rawProduct.description),
    price,
    image_url: toText(rawProduct.image_url ?? rawProduct.imageUrl ?? rawProduct.photo ?? rawProduct.image),
    stock,
    category: getCategory(rawProduct.category) ?? toText(rawProduct.categoryName ?? rawProduct.category_name),
    resolution: toText(rawProduct.resolution),
    night_vision: toBoolean(rawProduct.night_vision ?? rawProduct.nightVision),
    weather_resistance: toText(rawProduct.weather_resistance ?? rawProduct.weatherResistance),
    field_of_view: toText(rawProduct.field_of_view ?? rawProduct.fieldOfView),
    storage_capacity: toText(rawProduct.storage_capacity ?? rawProduct.storageCapacity),
    connectivity: toTextArray(rawProduct.connectivity),
    sensor_type: toText(rawProduct.sensor_type ?? rawProduct.sensorType),
    lens_focal_length: toText(rawProduct.lens_focal_length ?? rawProduct.lensFocalLength),
    power_consumption: toText(rawProduct.power_consumption ?? rawProduct.powerConsumption),
    operating_temperature: toText(rawProduct.operating_temperature ?? rawProduct.operatingTemperature),
  }
}

function normalizeProduct(rawProduct: unknown): Product | null {
  return normalizeProductRecord(rawProduct)
}

function normalizeCategory(rawCategory: unknown): Category | null {
  if (!isPlainObject(rawCategory)) {
    return null
  }

  const id = toText(rawCategory.id ?? rawCategory.code ?? rawCategory.category_id ?? rawCategory.categoryId)
  const name = toText(rawCategory.name ?? rawCategory.title ?? rawCategory.label)

  if (!id || !name) {
    return null
  }

  return {
    id,
    name,
    icon: toText(rawCategory.icon),
    description: toText(rawCategory.description),
    active: toBoolean(rawCategory.active ?? rawCategory.is_active ?? rawCategory.isActive ?? rawCategory.enabled) ?? true,
  }
}

function normalizeStoreOrderCustomer(rawCustomer: unknown): StoreOrderCustomer | null {
  if (!isPlainObject(rawCustomer)) {
    return null
  }

  return {
    name: toText(rawCustomer.name ?? rawCustomer.fullName ?? rawCustomer.customerName),
    email: toText(rawCustomer.email),
    phone: toText(rawCustomer.phone ?? rawCustomer.phoneNumber),
    address: toText(rawCustomer.address ?? rawCustomer.shippingAddress),
  }
}

function normalizeStoreOrderItem(rawItem: unknown): StoreOrderItem | null {
  if (!isPlainObject(rawItem)) {
    return null
  }

  const nestedProduct = isPlainObject(rawItem.product) ? rawItem.product : null
  const productId = toText(
    rawItem.productId ??
      rawItem.product_id ??
      rawItem.id ??
      nestedProduct?.id ??
      nestedProduct?.code,
  )
  const productName = toText(rawItem.productName ?? rawItem.product_name ?? rawItem.name ?? nestedProduct?.name)
  const productPrice = toNumber(
    rawItem.productPrice ??
      rawItem.product_price ??
      rawItem.price ??
      rawItem.salePrice ??
      rawItem.sale_price,
  )
  const quantity = toNumber(rawItem.quantity ?? rawItem.qty ?? rawItem.amount)

  if (!productId || !productName || productPrice === null || quantity === null) {
    return null
  }

  return {
    productId,
    productName,
    productPrice,
    quantity,
  }
}

function normalizeStoreOrder(rawOrder: unknown): StoreOrder | null {
  if (!isPlainObject(rawOrder)) {
    return null
  }

  const id = toText(rawOrder.id ?? rawOrder.orderId ?? rawOrder.order_id ?? rawOrder.uuid)
  if (!id) {
    return null
  }

  const orderId = toText(rawOrder.orderId ?? rawOrder.order_id ?? rawOrder.id) ?? id
  const rawItems = extractCollection(rawOrder, ["items", "orderItems", "lines", "details"])
  const items = rawItems
    ? rawItems.map(normalizeStoreOrderItem).filter((item): item is StoreOrderItem => item !== null)
    : []

  const customer = normalizeStoreOrderCustomer(rawOrder.customer ?? rawOrder.client ?? rawOrder.buyer)
  const total = toNumber(rawOrder.total ?? rawOrder.amount ?? rawOrder.subtotal)

  return {
    id,
    orderId,
    customer,
    items,
    total,
    status: toText(rawOrder.status ?? rawOrder.state ?? rawOrder.orderStatus),
    createdAt: toText(rawOrder.createdAt ?? rawOrder.created_at ?? rawOrder.created),
    updatedAt: toText(rawOrder.updatedAt ?? rawOrder.updated_at ?? rawOrder.updated),
  }
}

async function parseJsonResponse(response: Response) {
  try {
    return (await response.json()) as unknown
  } catch {
    return null
  }
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return "No pudimos conectar con el catálogo público."
}

export async function getProducts(): Promise<CatalogLoadResult> {
  const sourceUrl = joinApiUrl("/products")

  try {
    const response = await fetch(sourceUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return {
        ok: false,
        products: [],
        error: `No pudimos cargar el catálogo (${response.status} ${response.statusText || "Error"}).`,
        sourceUrl,
        status: response.status,
      }
    }

    const payload: unknown = await response.json()
    const rawProducts = extractCollection(payload, ["products", "data", "items"])

    if (!rawProducts) {
      return {
        ok: false,
        products: [],
        error: "La API del catálogo devolvió un formato inesperado.",
        sourceUrl,
      }
    }

    const products = rawProducts.map(normalizeProduct).filter((product): product is Product => product !== null)

    if (rawProducts.length > 0 && products.length === 0) {
      return {
        ok: false,
        products: [],
        error: "La API del catálogo devolvió productos incompletos o inválidos.",
        sourceUrl,
      }
    }

    return {
      ok: true,
      products,
      error: null,
      sourceUrl,
    }
  } catch (error) {
    return {
      ok: false,
      products: [],
      error: toErrorMessage(error),
      sourceUrl,
    }
  }
}

export async function getProductById(productId: string): Promise<ProductDetailLoadResult> {
  const trimmedId = productId.trim()
  const sourceUrl = joinApiUrl(`/products/${encodeURIComponent(trimmedId)}`)

  try {
    const response = await fetch(sourceUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (response.ok) {
      const payload = await parseJsonResponse(response)
      const payloadCandidate = extractRecord(payload, ["product", "item", "result"]) ?? payload
      const payloadData = isPlainObject(payloadCandidate)
        ? extractRecord(payloadCandidate.data, ["product", "item", "result"]) ?? payloadCandidate.data
        : null
      const product = normalizeProduct(payloadData ?? payloadCandidate)

      if (product) {
        return {
          ok: true,
          product,
          error: null,
          sourceUrl,
          status: response.status,
        }
      }
    }

    const catalog = await getProducts()
    const product = catalog.products.find(
      (item) =>
        item.id === trimmedId ||
        item.id === safeDecodeURIComponent(trimmedId) ||
        item.id === trimmedId.toLowerCase(),
    )

    if (product) {
      return {
        ok: true,
        product,
        error: null,
        sourceUrl: catalog.sourceUrl,
        status: response.status,
      }
    }

    return {
      ok: false,
      product: null,
      error: response.ok
        ? "El producto no pudo normalizarse desde la API pública."
        : `No pudimos cargar el detalle del producto (${response.status} ${response.statusText || "Error"}).`,
      sourceUrl,
      status: response.status,
    }
  } catch (error) {
    const catalog = await getProducts()
    const product = catalog.products.find(
      (item) =>
        item.id === trimmedId ||
        item.id === safeDecodeURIComponent(trimmedId) ||
        item.id === trimmedId.toLowerCase(),
    )

    if (product) {
      return {
        ok: true,
        product,
        error: null,
        sourceUrl: catalog.sourceUrl,
      }
    }

    return {
      ok: false,
      product: null,
      error: toErrorMessage(error),
      sourceUrl,
    }
  }
}

export async function getCategories(): Promise<CategoryLoadResult> {
  const sourceUrl = joinApiUrl("/categories")

  try {
    const response = await fetch(sourceUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return {
        ok: false,
        categories: [],
        error: `No pudimos cargar las categorías (${response.status} ${response.statusText || "Error"}).`,
        sourceUrl,
        status: response.status,
      }
    }

    const payload: unknown = await response.json()
    const rawCategories = extractCollection(payload, ["categories", "data", "items"])

    if (!rawCategories) {
      return {
        ok: false,
        categories: [],
        error: "La API de categorías devolvió un formato inesperado.",
        sourceUrl,
      }
    }

    const categories = rawCategories
      .map(normalizeCategory)
      .filter((category): category is Category => category !== null && category.active)

    if (rawCategories.length > 0 && categories.length === 0) {
      return {
        ok: false,
        categories: [],
        error: "La API de categorías devolvió datos incompletos o sin categorías activas.",
        sourceUrl,
      }
    }

    return {
      ok: true,
      categories,
      error: null,
      sourceUrl,
    }
  } catch (error) {
    return {
      ok: false,
      categories: [],
      error: toErrorMessage(error),
      sourceUrl,
    }
  }
}

export async function createOrder(orderData: OrderRequest): Promise<OrderResponse> {
  const sourceUrl = joinApiUrl("/orders")

  try {
    const response = await fetch(sourceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(orderData),
    })

    const payload = await parseJsonResponse(response)
    const payloadRecord = isPlainObject(payload) ? payload : null
    const payloadData = payloadRecord
      ? extractRecord(payloadRecord.data, ["order", "item", "result"]) ?? payloadRecord.data
      : null
    const payloadDataRecord = isPlainObject(payloadData) ? payloadData : null
    const orderId = toText(
      payloadRecord?.orderId ??
        payloadRecord?.id ??
        payloadRecord?.order_id ??
        payloadDataRecord?.orderId ??
        payloadDataRecord?.id,
    )
    const successFlag = payloadRecord
      ? toBoolean(payloadRecord.success ?? payloadRecord.ok ?? payloadRecord.created)
      : undefined
    const success = response.ok && (successFlag ?? Boolean(orderId))
    const message = payloadRecord
      ? toText(payloadRecord.message ?? payloadRecord.error ?? payloadRecord.detail)
      : null

    return {
      orderId: orderId ?? "",
      success,
      message: message ?? (success ? undefined : `Error al procesar el pedido (${response.status})`),
    }
  } catch (error) {
    console.error("Error creating order:", error)
    return {
      orderId: "",
      success: false,
      message: "Error al procesar el pedido",
    }
  }
}

export async function getOrderById(orderId: string): Promise<OrderLookupResult> {
  const trimmedOrderId = orderId.trim()
  const sourceUrl = joinApiUrl(`/orders/${encodeURIComponent(trimmedOrderId)}`)

  try {
    const response = await fetch(sourceUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return {
        ok: false,
        order: null,
        error: `No pudimos cargar la orden (${response.status} ${response.statusText || "Error"}).`,
        sourceUrl,
        status: response.status,
      }
    }

    const payload = await parseJsonResponse(response)
    const payloadCandidate = extractRecord(payload, ["order", "item", "result"]) ?? payload
    const payloadData = isPlainObject(payloadCandidate)
      ? extractRecord(payloadCandidate.data, ["order", "item", "result"]) ?? payloadCandidate.data
      : null
    const order = normalizeStoreOrder(payloadData ?? payloadCandidate)

    if (!order) {
      return {
        ok: false,
        order: null,
        error: "La API de órdenes devolvió un formato inesperado.",
        sourceUrl,
        status: response.status,
      }
    }

    return {
      ok: true,
      order,
      error: null,
      sourceUrl,
      status: response.status,
    }
  } catch (error) {
    return {
      ok: false,
      order: null,
      error: toErrorMessage(error),
      sourceUrl,
    }
  }
}
