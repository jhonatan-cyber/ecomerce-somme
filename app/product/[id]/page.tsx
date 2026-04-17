import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Camera, PackageSearch, ShieldCheck, Truck, Wifi } from "lucide-react"
import { ProductDetailActions } from "@/components/store/product-detail-actions"
import { ProductGallery } from "@/components/store/product-gallery"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { getProductById } from "@/lib/api"

export const dynamic = "force-dynamic"

function formatPrice(price: number) {
  return price.toLocaleString("es-CL")
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

  const hasSpecs =
    product.night_vision !== undefined ||
    product.resolution ||
    (product.connectivity && product.connectivity.length > 0) ||
    product.weather_resistance ||
    product.field_of_view

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="container mx-auto px-4 py-6 sm:py-10">
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
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">

          {/* Gallery */}
          <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-sm sm:rounded-[2rem]">
            <ProductGallery
              name={product.name}
              imageUrl={product.image_url}
              images={product.images}
            />
          </div>

          {/* Info column */}
          <div className="flex flex-col gap-4">

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
                <p className="mt-1 text-2xl font-black text-primary sm:text-3xl">
                  ${formatPrice(product.price)}
                </p>
              </div>

              {/* Stock indicator */}
              {product.stock > 0 && (
                <p className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  ✓ {product.stock} unidades disponibles
                </p>
              )}

              {/* Actions */}
              <ProductDetailActions product={product} />
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
      </main>

      <StoreFooter />
    </div>
  )
}
