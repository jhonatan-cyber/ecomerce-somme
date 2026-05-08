import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Camera, PackageSearch, ShieldCheck, Truck, Wifi } from "lucide-react"
import { ProductDetailActions } from "@/components/store/product-detail-actions"
import { ProductGallery } from "@/components/store/product-gallery"
import { TechnicalSpecs } from "@/components/store/technical-specs"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { getProductById, getProducts } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sommetechnology.com"

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}): Promise<Metadata> {
  const resolvedParams = await params
  const lookup = await getProductById(resolvedParams.id)
  const product = lookup.ok ? lookup.product : null

  if (!product) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscás no está disponible en este momento.",
      robots: { index: false, follow: false },
    }
  }

  const title = product.name
  const description =
    product.description ??
    [
      product.name,
      product.brand ? `Marca: ${product.brand}` : null,
      product.category,
      product.resolution ? `Resolución ${product.resolution}` : null,
      `Precio: $${formatPrice(product.price)}`,
    ]
      .filter(Boolean)
      .join(" — ")

  const canonical = `/product/${encodeURIComponent(product.id)}`
  const images = [product.image_url, ...(product.images ?? [])]
    .filter((u): u is string => Boolean(u))
    .slice(0, 4)
    .map((url) => ({ url, alt: product.name }))

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | Somme Technology`,
      description,
      url: canonical,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Somme Technology`,
      description,
      images: images.map((i) => i.url),
    },
  }
}

// ---------------------------------------------------------------------------
// JSON-LD structured data (Product schema)
// ---------------------------------------------------------------------------
function ProductJsonLd({ product }: { product: Product }) {
  const availability =
    product.stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock"

  const images = [product.image_url, ...(product.images ?? [])].filter(
    (u): u is string => Boolean(u),
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: images.length > 0 ? images : undefined,
    sku: product.id,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    category: product.category ?? undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${encodeURIComponent(product.id)}`,
      priceCurrency: "ARS",
      price: product.price,
      availability,
      seller: { "@type": "Organization", name: "Somme Technology" },
      ...(product.onSale && product.saleEndDate
        ? { priceValidUntil: product.saleEndDate }
        : {}),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ---------------------------------------------------------------------------
// Fallback UI
// ---------------------------------------------------------------------------
function ProductDetailFallback({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />
      <main className="container mx-auto flex min-h-[calc(100vh-180px)] items-center px-4 py-16">
        <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20">
            <PackageSearch className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-foreground">
            No pudimos abrir este producto
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-300"
            >
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
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
        message={lookup.error ?? "La API pública no devolvió un producto válido."}
      />
    )
  }

  // Suggested products — same category first, fill with same brand
  const [categoryLookup, brandLookup] = await Promise.all([
    product.categoryId
      ? getProducts({ categoryId: product.categoryId })
      : Promise.resolve({ ok: false, products: [] as Product[], error: null, sourceUrl: "" }),
    product.brandId
      ? getProducts({ brandId: product.brandId })
      : Promise.resolve({ ok: false, products: [] as Product[], error: null, sourceUrl: "" }),
  ])

  const categoryProducts = categoryLookup.ok
    ? categoryLookup.products.filter((p) => p.id !== product.id)
    : []

  const brandProducts = brandLookup.ok
    ? brandLookup.products.filter(
        (p) => p.id !== product.id && !categoryProducts.find((c) => c.id === p.id),
      )
    : []

  const suggestedProducts = [
    ...categoryProducts.slice(0, 6),
    ...brandProducts.slice(0, Math.max(0, 6 - categoryProducts.length)),
  ].slice(0, 6)

  const hasTechnicalSpecs =
    product.night_vision !== undefined ||
    product.resolution ||
    (product.connectivity && product.connectivity.length > 0) ||
    product.weather_resistance ||
    product.field_of_view ||
    product.storage_capacity ||
    product.sensor_type ||
    product.lens_focal_length ||
    product.power_consumption ||
    product.operating_temperature

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* JSON-LD structured data */}
      <ProductJsonLd product={product} />

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

        {/* Main grid */}
        <div className="grid gap-6 overflow-x-hidden lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Gallery */}
          <div className="overflow-hidden">
            <ProductGallery
              name={product.name}
              imageUrl={product.image_url}
              images={product.images}
            />
          </div>

          {/* Info column */}
          <div className="flex flex-col gap-4 pt-2 lg:pt-0">
            {/* Main info card */}
            <div className="rounded-[1.5rem] border border-border/70 bg-card p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
              {/* Category + brand */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                  {product.category || "Producto"}
                </span>
                {product.brandLogo && (
                  <div className="ml-auto flex h-6 items-center overflow-hidden rounded border border-border/60 bg-white px-1.5">
                    <Image
                      src={product.brandLogo}
                      alt={product.brand || "Marca"}
                      width={52}
                      height={18}
                      className="h-4 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                )}
                {!product.brandLogo && product.brand && (
                  <span className="ml-auto text-xs font-semibold text-muted-foreground">
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="mt-2 text-xl font-black leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {product.name}
              </h1>

              {/* Description */}
              {product.description && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {product.description}
                </p>
              )}

              {/* Price */}
              <div className="mt-4 rounded-xl bg-muted/60 px-4 py-3 sm:rounded-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Precio
                </p>
                {product.onSale && product.originalPrice && (
                  <p className="mt-0.5 text-sm text-muted-foreground line-through">
                    ${formatPrice(product.originalPrice)}
                  </p>
                )}
                <p
                  className={`mt-1 text-2xl font-black sm:text-3xl ${
                    product.onSale ? "text-red-600 dark:text-red-400" : "text-primary"
                  }`}
                >
                  ${formatPrice(product.price)}
                </p>
              </div>

              {/* Actions */}
              <ProductDetailActions product={product} />
            </div>

            {/* Technical Specs + Support */}
            <div className="space-y-4">
              <TechnicalSpecs product={product} />
              
              {/* Support Info */}
              <div className="rounded-[1.25rem] border border-border/70 bg-card p-4 shadow-sm sm:rounded-[1.5rem]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                  Soporte y Servicios
                </p>
                <div className="mt-3 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                    Garantía y asesoramiento técnico
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Truck className="h-4 w-4 shrink-0 text-primary" />
                    Envío coordinado a todo el país
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Wifi className="h-4 w-4 shrink-0 text-primary" />
                    Soporte remoto y configuración
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
                <Link
                  key={suggestedProduct.id}
                  href={`/product/${encodeURIComponent(suggestedProduct.id)}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-background transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {suggestedProduct.brandLogo && (
                      <div className="absolute right-1.5 top-1.5 z-10 overflow-hidden rounded-md bg-white/95 px-1.5 py-1 shadow backdrop-blur sm:px-2 sm:py-1">
                        <Image
                          src={suggestedProduct.brandLogo}
                          alt={suggestedProduct.brand || "Marca"}
                          width={50}
                          height={20}
                          className="h-4 w-auto object-contain sm:h-4"
                          unoptimized
                        />
                      </div>
                    )}
                    {suggestedProduct.onSale && suggestedProduct.discountPercent && (
                      <div className="absolute left-1.5 top-1.5 z-10 rounded-md bg-red-500 px-1.5 py-0.5">
                        <p className="text-[9px] font-black text-white sm:text-[10px]">
                          -{suggestedProduct.discountPercent}%
                        </p>
                      </div>
                    )}
                    {suggestedProduct.image_url ? (
                      <Image
                        src={suggestedProduct.image_url}
                        alt={suggestedProduct.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Camera className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1 p-2.5">
                    <p className="line-clamp-2 text-[11px] font-semibold text-foreground sm:text-xs">
                      {suggestedProduct.name}
                    </p>
                    <p
                      className={`mt-auto text-sm font-black ${
                        suggestedProduct.onSale
                          ? "text-red-600 dark:text-red-400"
                          : "text-primary"
                      }`}
                    >
                      ${formatPrice(suggestedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  )
}
