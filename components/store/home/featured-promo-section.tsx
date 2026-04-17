import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageCircle, Phone, ShieldCheck, Sparkles, TrendingUp, Truck, Wrench, Zap } from "lucide-react"
import type { Product, Brand, Category } from "@/lib/types"

interface FeaturedPromoSectionProps {
  products: Product[]
  brands: Brand[]
  categories: Category[]
}

function formatPrice(price: number) {
  return price.toLocaleString("es-CL")
}

export function FeaturedPromoSection({
  products,
  brands,
  categories,
}: FeaturedPromoSectionProps) {
  // Get the most expensive product as featured
  const featuredProduct = products.length > 0
    ? products.reduce((max, p) => (p.price > max.price ? p : max))
    : null

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const brandsWithLogos = brands.filter((b) => b.logo).length
  const inStockProducts = products.filter((p) => p.stock > 0).length

  return (
    <section className="container mx-auto px-4 pt-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-blue-50 via-white to-cyan-50/40 shadow-lg dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_380px] lg:gap-10 lg:p-10">
          
          {/* Left column */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wide text-primary">
                  Producto destacado
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-black leading-tight text-foreground sm:text-3xl lg:text-5xl">
                {featuredProduct?.name || "Catálogo profesional de seguridad"}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground lg:text-lg">
                {featuredProduct
                  ? "Sistema premium con las mejores especificaciones técnicas del mercado. Ideal para proyectos comerciales y residenciales."
                  : "Videovigilancia, cámaras IP, grabadores NVR y accesorios profesionales para tu proyecto."}
              </p>
            </div>

            {/* Services + Contact combined */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Services */}
              <div className="space-y-3 rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Servicios incluidos</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Despacho a toda Bolivia
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                      <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    Garantía oficial
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                      <Wrench className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Instalación profesional
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-cyan-500/10 p-5 backdrop-blur">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Asesoría técnica</p>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  Te ayudamos a elegir el sistema ideal para tu proyecto.
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://wa.me/59140000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:bg-emerald-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+59140000000"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/60"
                  >
                    <Phone className="h-4 w-4" />
                    Llamar
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Featured product card */}
          {featuredProduct && (
            <div className="w-full lg:w-[380px]">
              <div className="group sticky top-24 flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl transition hover:shadow-[0_24px_80px_-20px_rgba(29,78,216,0.35)]">
                {/* Premium badge */}
                <div className="absolute right-4 top-4 z-10 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 px-3 py-1.5 shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-900">
                    Premium
                  </p>
                </div>

                {/* Product image — sin padding, ocupa todo */}
                <div className="relative h-56 shrink-0 overflow-hidden">
                  {featuredProduct.image_url ? (
                    <Image
                      src={featuredProduct.image_url}
                      alt={featuredProduct.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-sm text-muted-foreground">Sin imagen</span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Product info — scrollable if needed */}
                <div className="flex flex-col gap-3 overflow-y-auto p-5">
                  {/* Brand */}
                  {featuredProduct.brandLogo ? (
                    <div className="flex h-7 w-fit items-center overflow-hidden rounded-lg border border-border/60 bg-white px-2 dark:bg-slate-800">
                      <Image
                        src={featuredProduct.brandLogo}
                        alt={featuredProduct.brand || "Marca"}
                        width={64}
                        height={24}
                        className="h-5 w-auto object-contain"
                        unoptimized
                      />
                    </div>
                  ) : featuredProduct.brand ? (
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {featuredProduct.brand}
                    </p>
                  ) : null}

                  {/* Name */}
                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground">
                    {featuredProduct.name}
                  </h3>

                  {/* Price — siempre visible */}
                  <div className="rounded-xl bg-gradient-to-br from-primary/10 to-cyan-500/10 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      Precio
                    </p>
                    <p className="mt-1 text-3xl font-black text-primary">
                      ${formatPrice(featuredProduct.price)}
                    </p>
                  </div>

                  {/* Stock */}
                  {featuredProduct.stock > 0 && (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ {featuredProduct.stock} unidades disponibles
                    </p>
                  )}

                  {/* CTA */}
                  <Link
                    href={`/product/${encodeURIComponent(featuredProduct.id)}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
                  >
                    Ver producto
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
