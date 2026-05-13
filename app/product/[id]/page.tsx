import Link from "next/link"
import Image from "next/image"
import { AlertTriangle, ArrowLeft, CalendarDays, Camera, CheckCircle2, PackageSearch, ShieldCheck, Tag, Truck, Wifi, XCircle } from "lucide-react"
import { ProductDetailActions } from "@/components/store/product-detail-actions"
import { ProductBranchStockTable } from "@/components/store/product-branch-stock-table"
import { ProductDescriptionText } from "@/components/store/product-description-text"
import { ProductGallery } from "@/components/store/product-gallery"
import { SuggestedProductCard } from "@/components/store/suggested-product-card"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { AutoTour } from "@/components/tour"
import { getProductById } from "@/lib/api"

export const dynamic = "force-dynamic"

function formatPrice(price: number) {
  return `BOB ${price.toLocaleString("es-CL")}`
}

function formatDateLabel(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function ProductDetailFallback({ productId, message }: { productId: string; message: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />
      <main className="container mx-auto flex min-h-[calc(100vh-180px)] items-center px-4 py-16">
        <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20">
            <PackageSearch className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-foreground">No pudimos abrir este producto</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/catalog" className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-300">
              <ArrowLeft className="h-4 w-4" />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await params
  const lookup = await getProductById(resolvedParams.id)
  const product = lookup.ok ? lookup.product : null

  if (!product) {
    return (
      <ProductDetailFallback
        productId={resolvedParams.id}
        message={lookup.error ?? "La API pública no devolvió un producto válido."}
      />
    )
  }

  // Get suggested products - same category first, fill with same brand if needed
  const { getProducts } = await import("@/lib/api")
  
  const [categoryLookup, brandLookup] = await Promise.all([
    product.categoryId 
      ? getProducts({ categoryId: product.categoryId, limit: 1000 }) 
      : Promise.resolve({ ok: false, products: [] as import("@/lib/types").Product[], error: null, sourceUrl: "" }),
    product.brandId
      ? getProducts({ brandId: product.brandId, limit: 1000 })
      : Promise.resolve({ ok: false, products: [] as import("@/lib/types").Product[], error: null, sourceUrl: "" }),
  ])

  const categoryProducts = categoryLookup.ok 
    ? categoryLookup.products.filter(p => p.id !== product.id)
    : []
  
  const brandProducts = brandLookup.ok
    ? brandLookup.products.filter(p => p.id !== product.id && !categoryProducts.find(c => c.id === p.id))
    : []

  // Combine: category first, then brand to fill up to 6
  const suggestedProducts = [
    ...categoryProducts.slice(0, 6),
    ...brandProducts.slice(0, Math.max(0, 6 - categoryProducts.length)),
  ].slice(0, 6)

  console.log('[SUGGESTED] Category products:', categoryProducts.length)
  console.log('[SUGGESTED] Brand products:', brandProducts.length)
  console.log('[SUGGESTED] Total suggested:', suggestedProducts.length)

  const hasSpecs =
    product.night_vision !== undefined ||
    product.resolution ||
    (product.connectivity && product.connectivity.length > 0) ||
    product.weather_resistance ||
    product.field_of_view

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AutoTour page="product" delay={1500} />
      <StoreHeader />

      <main className="container mx-auto overflow-x-hidden px-4 py-6 sm:py-10">
        {/* Back nav */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Catálogo
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60"
          >
            Ver carrito
          </Link>
        </div>

        {/* Main grid — stacked on mobile, side by side on lg */}
        <div className="grid gap-6 overflow-x-hidden lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">

          {/* Gallery - sin contenedor card */}
          <div className="overflow-hidden">
            <ProductGallery
              name={product.name}
              imageUrl={product.image_url}
              images={product.images}
            />
          </div>

          {/* Info column — gap on mobile */}
          <div data-tour="product-info" className="flex flex-col gap-4 pt-2 lg:pt-0">

            {/* Main info card */}
            <div className="rounded-[1.5rem] border border-border/70 bg-card p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
              {/* Category + brand — solo categoría arriba */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                  {product.category || "Producto"}
                </span>
              </div>

              {/* Name */}
              <h1 className="mt-2 text-xl font-black leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {product.name}
              </h1>

              {/* Description */}
              {product.description && (
                <ProductDescriptionText text={product.description} />
              )}

              {/* Brand logo — debajo de la descripción, más grande */}
              {product.brandLogo ? (
                <div className="mt-3 flex justify-end">
                  <div className="inline-flex items-center overflow-hidden rounded-lg border border-border/60 bg-white px-3 py-2">
                    <Image
                      src={product.brandLogo}
                      alt={product.brand || "Marca"}
                      width={80}
                      height={32}
                      className="h-7 w-auto object-contain sm:h-8"
                      unoptimized
                    />
                  </div>
                </div>
              ) : product.brand ? (
                <p className="mt-2 text-right text-xs font-semibold text-muted-foreground">
                  {product.brand}
                </p>
              ) : null}

              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Camera className="h-3 w-3 shrink-0 text-primary/60" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Modelo</p>
                  </div>
                  <p className="mt-1 font-semibold text-foreground">{product.model ? product.model.toUpperCase() : "No disponible"}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3 w-3 shrink-0 text-primary/60" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Código / SKU</p>
                  </div>
                  <p className="mt-1 font-semibold text-foreground">{product.sku || product.code || "No disponible"}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3 shrink-0 text-primary/60" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Próxima llegada</p>
                  </div>
                  <p className="mt-1 font-semibold text-foreground">
                    {formatDateLabel(product.nextArrivalDate) || "Sin fecha confirmada"}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 rounded-xl border border-border/70 bg-background px-4 py-3 sm:rounded-2xl sm:p-5">
                {product.onSale ? (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-500">
                        Precio oferta
                      </p>
                      {product.discountPercent && (
                        <span className="rounded-full bg-red-500 px-2 py-px text-[10px] font-black text-white">
                          -{product.discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-col gap-0.5">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm font-semibold text-red-500 line-through">
                          Antes {formatPrice(product.originalPrice)}
                        </p>
                      )}
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 sm:text-3xl">
                        Ahora {formatPrice(product.price)}
                      </p>
                    </div>
                    {product.saleEndDate && formatDateLabel(product.saleEndDate) && (
                      <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground">
                        Oferta válida hasta {formatDateLabel(product.saleEndDate)}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Precio
                    </p>
                    <p className="mt-1 text-2xl font-black text-primary sm:text-3xl">
                      {formatPrice(product.price)}
                    </p>
                  </>
                )}

                {/* Stock indicator */}
                <div className="mt-2.5 flex items-center gap-2">
                  {product.stock > 0 ? (
                    product.stock >= 10 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        En stock · {product.stock} unidades
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        Pocas unidades · {product.stock} disponibles
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
                      <XCircle className="h-3 w-3" />
                      Agotado
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <ProductDetailActions product={product} />
              <ProductBranchStockTable product={product} />
            </div>

            {/* Specs + support — side by side on sm, stacked on xs */}
            <div className="grid gap-4 sm:grid-cols-2">
              {hasSpecs && (
                <div className="rounded-[1.25rem] border border-border/70 bg-card p-4 shadow-sm sm:rounded-[1.5rem]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                    Ficha rápida
                  </p>
                  <div className="mt-3 space-y-2.5 text-sm">
                    {product.resolution && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Resolución</span>
                        <span className="font-semibold">{product.resolution}</span>
                      </div>
                    )}
                    {product.night_vision !== undefined && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Visión nocturna</span>
                        <span className="font-semibold">{product.night_vision ? "Sí" : "No"}</span>
                      </div>
                    )}
                    {product.connectivity && product.connectivity.length > 0 && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Conectividad</span>
                        <span className="font-semibold">{product.connectivity.join(", ")}</span>
                      </div>
                    )}
                    {product.weather_resistance && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Resistencia</span>
                        <span className="font-semibold">{product.weather_resistance}</span>
                      </div>
                    )}
                    {product.field_of_view && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Campo visual</span>
                        <span className="font-semibold">{product.field_of_view}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-[1.25rem] border border-border/70 bg-card p-4 shadow-sm sm:rounded-[1.5rem]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                  Soporte
                </p>
                <div className="mt-3 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                    Garantía y asesoramiento
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Truck className="h-4 w-4 shrink-0 text-primary" />
                    Envío coordinado
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Wifi className="h-4 w-4 shrink-0 text-primary" />
                    Catálogo en tiempo real
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Products */}
        {suggestedProducts.length > 0 && (
          <div className="mt-6 sm:mt-16">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <div>
                <h2 className="text-lg font-black text-foreground sm:text-2xl">
                  Productos relacionados
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                  Otros productos de {product.category || "esta categoría"}
                </p>
              </div>
              {product.categoryId && (
                <Link
                  href={`/catalog?category=${encodeURIComponent(product.categoryId)}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:underline"
                >
                  Ver todos
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
              {suggestedProducts.map((suggestedProduct) => (
                <SuggestedProductCard key={suggestedProduct.id} product={suggestedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  )
}
