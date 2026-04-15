import Link from "next/link"
import { ArrowLeft, Camera, PackageSearch, ShieldCheck, Truck, Wifi } from "lucide-react"
import { ProductDetailActions } from "@/components/store/product-detail-actions"
import { ProductGallery } from "@/components/store/product-gallery"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { Card, CardContent } from "@/components/ui/card"
import { getProductById } from "@/lib/api"

export const dynamic = "force-dynamic"

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`
}

function ProductDetailFallback({
  productId,
  message,
}: {
  productId: string
  message: string
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />
      <main className="container mx-auto flex min-h-[calc(100vh-180px)] items-center px-4 py-16">
        <div className="mx-auto grid w-full max-w-3xl gap-8 rounded-[2rem] border border-border/70 bg-card p-8 shadow-sm lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20">
            <PackageSearch className="h-9 w-9" />
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-primary">Detalle publico</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">No pudimos abrir este producto</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{message}</p>
            <p className="mt-2 text-xs font-mono text-muted-foreground">ID: {productId}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-slate-800">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Fuente real desde el dashboard
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-slate-800">
                <Camera className="h-4 w-4 text-primary" />
                Sin ficha fantasma
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#catalogo" className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-300">
                <ArrowLeft className="h-4 w-4" />
                Volver al catalogo
              </Link>
              <Link href="/cart" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-muted/60">
                Ir al carrito
              </Link>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params
  const lookup = await getProductById(resolvedParams.id)
  const product = lookup.ok ? lookup.product : null

  if (!product) {
    return <ProductDetailFallback productId={resolvedParams.id} message={lookup.error ?? "La API publica no devolvio un producto valido para este detalle."} />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/#catalogo" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Volver al catalogo
          </Link>
          <Link href="/cart" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-muted/60">
            Ver carrito
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden rounded-[2rem] border-border/70 shadow-sm">
            <CardContent className="p-0">
              <ProductGallery name={product.name} imageUrl={product.image_url} images={product.images} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">{product.category || "Producto publico"}</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{product.name}</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                {product.description || "Producto publicado desde el dashboard para el storefront publico."}
              </p>

              <div className="mt-6">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Precio</p>
                  <p className="mt-2 text-3xl font-black text-primary">{formatPrice(product.price)}</p>
                </div>
              </div>

              <ProductDetailActions product={product} />
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">Ficha rapida</p>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  {product.night_vision !== undefined && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Vision nocturna</span>
                      <span className="font-semibold">{product.night_vision ? "Si" : "No"}</span>
                    </div>
                  )}
                  {product.resolution && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Resolucion</span>
                      <span className="font-semibold">{product.resolution}</span>
                    </div>
                  )}
                  {product.connectivity && product.connectivity.length > 0 && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Conectividad</span>
                      <span className="font-semibold">{product.connectivity.join(", ")}</span>
                    </div>
                  )}
                  {product.weather_resistance && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Resistencia</span>
                      <span className="font-semibold">{product.weather_resistance}</span>
                    </div>
                  )}
                  {product.field_of_view && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Campo visual</span>
                      <span className="font-semibold">{product.field_of_view}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">Soporte comercial</p>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Garantia y asesoramiento
                  </div>
                  <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
                    <Truck className="h-4 w-4 text-primary" /> Envio coordinado
                  </div>
                  <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
                    <Wifi className="h-4 w-4 text-primary" /> Integracion con catalogo real
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
