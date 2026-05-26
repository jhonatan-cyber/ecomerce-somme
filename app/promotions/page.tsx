import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Flame, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { PromotionProductCard } from "@/components/store/promotion-product-card"
import { getOnSaleProducts } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Ofertas y Promociones | Somme Technology",
  description:
    "Descubre descuentos activos, oportunidades por volumen y equipos destacados en promoción para proyectos de seguridad electrónica.",
  alternates: { canonical: "/promotions" },
  openGraph: {
    title: "Ofertas y Promociones | Somme Technology",
    description: "Descuentos activos, oportunidades por volumen y equipos destacados en promoción.",
    url: "/promotions",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Ofertas y Promociones | Somme Technology", description: "Descuentos activos, oportunidades por volumen y equipos destacados en promoción." },
}

function getSaleDeadlineLabel(dateValue: string | null | undefined) {
  if (!dateValue) return "Oferta sin fecha límite visible"

  const target = new Date(dateValue)
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return "Termina hoy"
  if (diffDays === 1) return "Termina mañana"
  if (diffDays <= 6) return `${diffDays} días restantes`

  return `Vigente hasta ${target.toLocaleDateString("es-BO", {
    day: "numeric",
    month: "short",
  })}`
}

function getSavings(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0
  return product.originalPrice - product.price
}

function getPrimaryImage(product: Product) {
  return [product.image_url, ...(product.images ?? [])].find(Boolean) ?? null
}

function PromoHero({
  product,
  totalOnSale,
}: {
  product: Product
  totalOnSale: number
}) {
  const image = getPrimaryImage(product)
  const savings = getSavings(product)
  const deadline = getSaleDeadlineLabel(product.saleEndDate)

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),_transparent_32%),linear-gradient(135deg,#111827_0%,#0f172a_44%,#1f2937_100%)] text-white shadow-[0_30px_120px_-40px_rgba(15,23,42,0.95)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,transparent_22%,transparent_78%,rgba(255,255,255,0.04)_100%)]" />
      <div className="pointer-events-none absolute right-[-8%] top-[-12%] h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12%] left-[-4%] h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.26em] text-orange-100">
                <Sparkles className="h-3.5 w-3.5" />
                Semana de ofertas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white shadow-lg shadow-orange-500/30">
                <Flame className="h-3.5 w-3.5" />
                {totalOnSale} promociones activas
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Precios calientes para cerrar compras más rápido.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Reunimos las mejores oportunidades visibles del catálogo en una sola página, con énfasis en stock real,
              ahorro inmediato y salidas rápidas hacia producto o cotización.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-200">Mayor descuento</p>
              <p className="mt-2 text-3xl font-black text-white">-{product.discountPercent ?? 0}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">Ahorro destacado</p>
              <p className="mt-2 text-3xl font-black text-white">{formatPrice(savings || product.price)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">Ventana activa</p>
              <p className="mt-2 text-sm font-bold text-white">{deadline}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-orange-500 px-7 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(249,115,22,0.8)] hover:bg-orange-400"
            >
              <Link href={`/product/${encodeURIComponent(product.id)}`} scroll>
                Ver oferta principal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%)]" />
          <div className="relative flex h-full flex-col">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-200">Oferta protagonista</p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-white">{product.name}</h2>
              </div>
              {product.brandLogo ? (
                <div className="rounded-2xl bg-white px-3 py-2 shadow-lg">
                  <Image
                    src={product.brandLogo}
                    alt={product.brand ?? "Marca"}
                    width={80}
                    height={28}
                    className="h-6 w-auto object-contain"
                    unoptimized
                  />
                </div>
              ) : null}
            </div>

            <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-[1.5rem] bg-slate-950/70">
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
                  Sin imagen destacada
                </div>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.68)_100%)]" />
              <div className="absolute left-4 top-4 rounded-2xl bg-red-500 px-3 py-2 text-white shadow-xl shadow-red-500/30">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]">Flash price</p>
                <p className="text-2xl font-black">-{product.discountPercent ?? 0}%</p>
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-md">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    {product.originalPrice ? (
                      <p className="text-sm text-slate-400 line-through">{formatPrice(product.originalPrice)}</p>
                    ) : null}
                    <p className="text-3xl font-black text-white">{formatPrice(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">Vigencia</p>
                    <p className="mt-1 text-sm font-semibold text-orange-200">{deadline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function PromotionsPage() {
  const saleCatalog = await getOnSaleProducts()
  const saleProducts = saleCatalog.ok
    ? saleCatalog.products.filter((product) => product.onSale)
    : []

  const sortedProducts = [...saleProducts].sort(
    (left, right) => (right.discountPercent ?? 0) - (left.discountPercent ?? 0),
  )
  const heroProduct = sortedProducts[0] ?? null
  const gridProducts = heroProduct ? sortedProducts.slice(1, 9) : sortedProducts.slice(0, 8)
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#fff 16%,#fff 100%)] text-foreground dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_16%,#020617_100%)]">
      <StoreHeader />

      <main className="pb-16">
        <section className="container mx-auto px-4 pt-6 sm:pt-8">
          {heroProduct ? (
            <PromoHero product={heroProduct} totalOnSale={sortedProducts.length} />
          ) : (
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_20px_80px_-50px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900 sm:px-10">
              <div className="mx-auto max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-500">Promociones</p>
                <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
                  Estamos preparando la próxima ola de ofertas.
                </h1>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                  Cuando activemos descuentos visibles en el catálogo, esta página se convertirá en el centro de campañas,
                  bundles y oportunidades para clientes finales y B2B.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="rounded-full bg-orange-500 px-7 hover:bg-orange-400">
                    <Link href="/catalog">
                      Explorar catálogo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          )}
        </section>

        <section className="container mx-auto px-4 pt-10">
          {gridProducts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {gridProducts.map((product) => (
                <PromotionProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : heroProduct ? (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm font-medium text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
              La oferta principal está activa y pronto sumaremos más productos destacados aquí.
            </div>
          ) : null}
        </section>

      </main>

      <StoreFooter />
    </div>
  )
}



