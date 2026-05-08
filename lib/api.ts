import type {
  Brand,
  BrandLoadResult,
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

// Importar la función createOrder del archivo separado
export { createOrder } from './api-create-order'

export type { BrandLoadResult } from "./types"

function resolveStoreApiRoot() {
  if (typeof window !== "undefined") {
    return "/api/store"
  }

  const explicitStoreRoot = process.env.NEXT_PUBLIC_STORE_API_URL?.trim()
  if (explicitStoreRoot) {
    return explicitStoreRoot
  }

  const apiRoot = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (apiRoot) {
    const normalizedApiRoot = apiRoot.replace(/\/$/, "")

    if (normalizedApiRoot.endsWith("/store")) {
      return normalizedApiRoot
    }

    return `${normalizedApiRoot}/store`
  }

  return "/api/store"
}

const STORE_API_ROOT = resolveStoreApiRoot()

// Skip ngrok browser warning page for API calls
const BASE_HEADERS: Record<string, string> = {
  Accept: "application/json",
  "ngrok-skip-browser-warning": "true",
}

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

function getBrandName(value: unknown): string | null {
  if (typeof value === "string") {
    return toText(value)
  }

  if (value && typeof value === "object") {
    const brand = value as Record<string, unknown>
    return toText(brand.name ?? brand.label ?? brand.title)
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

  const brandId = toText(rawProduct.brandId ?? rawProduct.brand_id) ?? null

  return {
    id,
    name,
    description: toText(rawProduct.description),
    price,
    originalPrice: toNumber(rawProduct.originalPrice ?? rawProduct.original_price) ?? null,
    discountPercent: toNumber(rawProduct.discountPercent ?? rawProduct.discount_percent) ?? null,
    onSale: toBoolean(rawProduct.onSale ?? rawProduct.on_sale) ?? false,
    saleEndDate: toText(rawProduct.saleEndDate ?? rawProduct.sale_end_date) ?? null,
    image_url: toText(rawProduct.image_url ?? rawProduct.imageUrl ?? rawProduct.photo ?? rawProduct.image),
    images: toTextArray(rawProduct.images ?? rawProduct.photos),
    stock,
    minimumStock: toNumber(rawProduct.minimumStock ?? rawProduct.minimum_stock) ?? 0,
    category: getCategory(rawProduct.category) ?? toText(rawProduct.categoryName ?? rawProduct.category_name),
    categoryId: toText(rawProduct.categoryId ?? rawProduct.category_id) ?? null,
    brand:
      getBrandName(rawProduct.brand) ??
      toText(rawProduct.brandName ?? rawProduct.brand_name) ??
      null,
    brandId,
    brandLogo: toText(rawProduct.brandLogo ?? rawProduct.brand_image) ?? null,
    resolution: toText(rawProduct.resolution) || undefined,
    night_vision: toBoolean(rawProduct.night_vision ?? rawProduct.nightVision),
    weather_resistance: toText(rawProduct.weather_resistance ?? rawProduct.weatherResistance) || undefined,
    field_of_view: toText(rawProduct.field_of_view ?? rawProduct.fieldOfView) || undefined,
    storage_capacity: toText(rawProduct.storage_capacity ?? rawProduct.storageCapacity) || undefined,
    connectivity: toTextArray(rawProduct.connectivity) || undefined,
    sensor_type: toText(rawProduct.sensor_type ?? rawProduct.sensorType) || undefined,
    lens_focal_length: toText(rawProduct.lens_focal_length ?? rawProduct.lensFocalLength) || undefined,
    power_consumption: toText(rawProduct.power_consumption ?? rawProduct.powerConsumption) || undefined,
    operating_temperature: toText(rawProduct.operating_temperature ?? rawProduct.operatingTemperature) || undefined,
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

  // Normalize children/subcategories
  const rawChildren = extractCollection(rawCategory.children ?? rawCategory.subcategories, ["children", "subcategories"])
  const children = rawChildren
    ? rawChildren.map(normalizeCategory).filter((c): c is Category => c !== null)
    : undefined

  return {
    id,
    name,
    icon: toText(rawCategory.icon),
    description: toText(rawCategory.description),
    active: toBoolean(rawCategory.active ?? rawCategory.is_active ?? rawCategory.isActive ?? rawCategory.enabled) ?? true,
    parentId: toText(rawCategory.parentId ?? rawCategory.parent_id) ?? null,
    children: children && children.length > 0 ? children : undefined,
  }
}

function normalizeBrand(rawBrand: unknown): Brand | null {
  if (!isPlainObject(rawBrand)) {
    return null
  }

  const id = toText(rawBrand.id ?? rawBrand.brand_id ?? rawBrand.brandId)
  const name = toText(rawBrand.name ?? rawBrand.title ?? rawBrand.label)

  if (!id || !name) {
    return null
  }

  return {
    id,
    name,
    logo: toText(rawBrand.logo ?? rawBrand.image ?? rawBrand.photo),
    active: toBoolean(rawBrand.active ?? rawBrand.is_active ?? rawBrand.isActive ?? rawBrand.enabled) ?? true,
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

export async function getSlides(): Promise<{ ok: boolean; slides: { url: string; alt: string }[] }> {
  const sourceUrl = joinApiUrl("/slides")
  try {
    const response = await fetch(sourceUrl, { next: { revalidate: 60 }, headers: { Accept: "application/json" } })
    if (!response.ok) return { ok: false, slides: [] }
    const payload = await response.json() as { data?: { url: string; alt: string }[] }
    return { ok: true, slides: payload.data ?? [] }
  } catch {
    return { ok: false, slides: [] }
  }
}

export async function getOnSaleProducts(): Promise<CatalogLoadResult> {
  const sourceUrl = joinApiUrl("/products/on-sale")

  try {
    const response = await fetch(sourceUrl, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      return { ok: false, products: [], error: `Error ${response.status}`, sourceUrl, status: response.status }
    }

    const payload: unknown = await response.json()
    const rawProducts = extractCollection(payload, ["products", "data", "items"])
    if (!rawProducts) return { ok: false, products: [], error: "Formato inesperado", sourceUrl }

    const products = rawProducts.map(normalizeProduct).filter((p): p is Product => p !== null)
    return { ok: true, products, error: null, sourceUrl }
  } catch (error) {
    return { ok: false, products: [], error: toErrorMessage(error), sourceUrl }
  }
}

export function getRelatedCategoryIds(
  categories: Category[],
  categoryId: string
): string[] {
  const category = categories.find(c => c.id === categoryId)
  if (!category) return [categoryId]
  
  const relatedIds = [categoryId]
  
  // Add direct children
  if (category.children) {
    relatedIds.push(...category.children.map(child => child.id))
  }
  
  // Add categories with similar names (for cameras, etc.)
  const categoryName = category.name.toLowerCase()
  const similarCategories = categories.filter(c => 
    c.id !== categoryId && 
    !c.parentId && // Only root categories
    (
      c.name.toLowerCase().includes(categoryName) || 
      categoryName.includes(c.name.toLowerCase()) ||
      (c.name.toLowerCase().includes('camara') && categoryName.includes('camara')) ||
      (c.name.toLowerCase().includes('cámara') && categoryName.includes('cámara'))
    )
  )
  
  relatedIds.push(...similarCategories.map(c => c.id))
  
  return [...new Set(relatedIds)] // Remove duplicates
}

export async function getProducts(options: {
  search?: string | null
  categoryId?: string | null
  subcategoryId?: string | null
  brandId?: string | null
  categories?: Category[] // Pass categories for related category logic
} = {}): Promise<CatalogLoadResult> {
  const url = new URL(joinApiUrl("/products"))
  const normalizedSearch = toText(options.search)
  const normalizedCategoryId = toText(options.categoryId)
  const normalizedSubcategoryId = toText(options.subcategoryId)
  const normalizedBrandId = toText(options.brandId)

  if (normalizedSearch) {
    url.searchParams.set("search", normalizedSearch)
  }

  if (normalizedSubcategoryId) {
    url.searchParams.set("subcategoryId", normalizedSubcategoryId)
  } else if (normalizedCategoryId) {
    url.searchParams.set("categoryId", normalizedCategoryId)
  }

  if (normalizedBrandId) {
    url.searchParams.set("brandId", normalizedBrandId)
  }

  const sourceUrl = url.toString()

  try {
    const response = await fetch(sourceUrl, {
      next: {
        revalidate: normalizedSearch || normalizedCategoryId || normalizedSubcategoryId || normalizedBrandId ? 30 : 120,
      },
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

    // Fallback: If brandId filter is used, also get products by brand name
    // to catch products that might not have brandId properly set
    let finalProducts = products
    if (normalizedBrandId) {
      try {
        const allProductsUrl = joinApiUrl("/products")
        const allResponse = await fetch(allProductsUrl, {
          next: { revalidate: 120 },
          headers: { Accept: "application/json" },
        })
        
        if (allResponse.ok) {
          const allPayload = await allResponse.json()
          const allRawProducts = extractCollection(allPayload, ["products", "data", "items"])
          if (allRawProducts) {
            const allProducts = allRawProducts.map(normalizeProduct).filter((p): p is Product => p !== null)
            // Get brand name from brands API or use a simple mapping
            const brandsResponse = await fetch(joinApiUrl("/brands"), {
              next: { revalidate: 300 },
              headers: { Accept: "application/json" },
            })
            
            if (brandsResponse.ok) {
              const brandsPayload = await brandsResponse.json()
              const rawBrands = extractCollection(brandsPayload, ["brands", "data", "items"])
              if (rawBrands) {
                const brands = rawBrands.map(normalizeBrand).filter((b): b is Brand => b !== null)
                const targetBrand = brands.find(b => b.id === normalizedBrandId)
                
                if (targetBrand) {
                  const productsByBrandId = allProducts.filter(p => p.brandId === targetBrand.id)
                  // Combine products from brandId filter and brand name filter, removing duplicates
                  const combinedProducts = [...finalProducts, ...productsByBrandId]
                  const uniqueProducts = combinedProducts.filter((product, index, self) =>
                    index === self.findIndex((p) => p.id === product.id)
                  )
                  finalProducts = uniqueProducts
                }
              }
            }
          }
        }
      } catch (error) {
        // If fallback fails, continue with empty results
        console.warn("Fallback brand search failed:", error)
      }
    }

    if (rawProducts.length > 0 && finalProducts.length === 0) {
      return {
        ok: false,
        products: [],
        error: "La API del catálogo devolvió productos incompletos o inválidos.",
        sourceUrl,
      }
    }

    return {
      ok: true,
      products: finalProducts,
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
      next: {
        revalidate: 120,
      },
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
      next: {
        revalidate: 300,
      },
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

export function getBrandNameById(brands: Brand[], brandId: string): string {
  const brand = brands.find(b => b.id === brandId)
  return brand ? brand.name : `Marca Desconocida (${brandId})`
}

export async function getBrands(): Promise<BrandLoadResult> {
  const sourceUrl = joinApiUrl("/brands")

  try {
    const response = await fetch(sourceUrl, {
      next: {
        revalidate: 300,
      },
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return {
        ok: false,
        brands: [],
        error: `No pudimos cargar las marcas (${response.status} ${response.statusText || "Error"}).`,
        sourceUrl,
        status: response.status,
      }
    }

    const payload: unknown = await response.json()
    const rawBrands = extractCollection(payload, ["brands", "data", "items"])

    if (!rawBrands) {
      return {
        ok: false,
        brands: [],
        error: "La API de marcas devolvió un formato inesperado.",
        sourceUrl,
      }
    }

    const brands = rawBrands
      .map(normalizeBrand)
      .filter((brand): brand is Brand => brand !== null && brand.active)

    if (rawBrands.length > 0 && brands.length === 0) {
      return {
        ok: false,
        brands: [],
        error: "La API de marcas devolvió datos incompletos o sin marcas activas.",
        sourceUrl,
      }
    }

    return {
      ok: true,
      brands,
      error: null,
      sourceUrl,
    }
  } catch (error) {
    return {
      ok: false,
      brands: [],
      error: toErrorMessage(error),
      sourceUrl,
    }
  }
}

// Función para obtener un pedido por ID (usada en página de confirmación)
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
    // Si el backend falla, intentar buscar en localStorage
    if (typeof window !== 'undefined') {
      try {
        const unifiedOrders = JSON.parse(localStorage.getItem('somme_local_orders') || '[]')
        const legacyOrders = JSON.parse(localStorage.getItem('somme_orders') || '[]')
        const localOrders = [...unifiedOrders, ...legacyOrders]
        const localOrder = localOrders.find((order: any) => order.id === trimmedOrderId)
        
        if (localOrder) {
          return {
            ok: true,
            order: normalizeStoreOrder(localOrder),
            error: null,
            sourceUrl: 'localStorage',
            status: 200,
          }
        }
      } catch {
        // Ignorar error de localStorage
      }
    }

    return {
      ok: false,
      order: null,
      error: toErrorMessage(error),
      sourceUrl,
    }
  }
}
