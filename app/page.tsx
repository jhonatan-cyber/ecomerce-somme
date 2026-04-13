import Image from "next/image"
import Link from "next/link"
import { getCategories, getProducts } from "@/lib/api"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { AlertTriangle, ArrowRight, ChevronRight, Clock3, Headphones, PackageSearch, ShieldCheck, Star, TicketPercent, Truck, Zap } from "lucide-react"
import type { Category, Product } from "@/lib/types"

export const dynamic = "force-dynamic"

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`
}

function CatalogStatusPage({
  badge,
  title,
  message,
  actionLabel,
}: {
  badge: string
  title: string
  message: string
  actionLabel: string
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
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-primary">{badge}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{message}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-slate-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Sin catálogo fantasma
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-slate-800">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Fuente real desde el dashboard
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-300">
                {actionLabel}
                <ArrowRight className="h-4 w-4" />
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

function ProductThumb({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group block rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-muted">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Sin imagen</div>
        )}
      </div>
      <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-900">{product.name}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-base font-black text-primary">{formatPrice(product.price)}</span>
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 transition group-hover:text-primary">
          Ver detalle
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

function ProductListItem({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
        {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover" /> : <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">No img</div>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</p>
        <p className="mt-1 text-sm font-black text-primary">{formatPrice(product.price)}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  )
}

function buildFallbackCategories(products: Product[]): Category[] {
  const names = Array.from(
    new Set(
      products
        .map((product) => product.category?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  )

  if (names.length > 0) {
    return names.map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      icon: null,
      description: null,
      active: true,
    }))
  }

  return [
    "Camaras IP",
    "Kits de seguridad",
    "Grabadores NVR",
    "Accesorios",
    "Video porteros",
    "Audio y sirenas",
    "Sensores",
    "Automatizacion",
  ].map((name) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    icon: null,
    description: null,
    active: true,
  }))
}

function PromoBanner({ title, subtitle, accent }: { title: string; subtitle: string; accent: string }) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-card p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">{subtitle}</p>
      <h3 className="mt-3 text-xl font-black leading-tight text-slate-900">{title}</h3>
      <div className={`mt-5 h-1.5 w-16 rounded-full ${accent}`} />
    </article>
  )
}

export default async function HomePage() {
  const [catalog, categoryCatalog] = await Promise.all([getProducts(), getCategories()])

  if (!catalog.ok) {
    return (
      <CatalogStatusPage
        badge="Catalog sync failed"
        title="No pudimos cargar el catálogo público"
        message={catalog.error ?? "La API del dashboard no respondió con un catálogo válido."}
        actionLabel="Reintentar"
      />
    )
  }

  if (catalog.products.length === 0) {
    return (
      <CatalogStatusPage
        badge="Catalog empty"
        title="Todavía no hay productos publicados"
        message="El dashboard está bien conectado, pero aún no expone productos activos para mostrar en el storefront."
        actionLabel="Volver a inicio"
      />
    )
  }

  const products = catalog.products
  const fallbackCategories = buildFallbackCategories(products)
  const categories = categoryCatalog.ok && categoryCatalog.categories.length > 0 ? categoryCatalog.categories : fallbackCategories
  const topRow = products.slice(0, 4)
  const bestSellers = products.slice(4, 10)
  const recent = products.slice(2, 8)
  const editorialLeft = products.slice(0, 3)
  const editorialRight = products.slice(3, 6)
  const heroProduct = products[0]
  const centerShowcase = products[1]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="pb-8">
        <section className="container mx-auto px-4 pt-6">
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="rounded-[1.75rem] border border-border/70 bg-card shadow-sm">
              <div className="rounded-t-[1.75rem] bg-yellow-400 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950">
                All Departments
              </div>
              <nav className="divide-y divide-border/60">
                {categories.map((category) => (
                  <Link key={category.id} href="#catalogo" title={category.description ?? undefined} className="flex items-center justify-between px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-muted/60 hover:text-primary">
                    <span>{category.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </nav>
            </aside>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#f7f7f8_0%,#ffffff_45%,#eef4ff_100%)] shadow-sm">
                <div className="grid gap-6 p-8 lg:grid-cols-[1fr_320px] lg:items-center lg:p-10">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-slate-500">The New Standard</p>
                    <h1 className="mt-3 max-w-lg text-4xl font-black leading-tight text-slate-900 lg:text-5xl">
                      Seguridad y tecnologia para un e-commerce que se ve premium.
                    </h1>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 lg:text-base">
                      Somme Thechnologhy ahora arranca con una landing tipo electronics marketplace: categorias visibles, promos, productos destacados y una estructura que empuja compra.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Starting from</p>
                        {heroProduct ? (
                          <p className="mt-1 text-4xl font-black text-slate-950">{formatPrice(heroProduct.price)}</p>
                        ) : (
                          <p className="mt-1 text-base font-semibold text-slate-500">Catálogo pendiente de sincronización</p>
                        )}
                      </div>
                      <Link href="#catalogo" className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-300">
                        Shop now
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="relative mx-auto flex aspect-[4/3] w-full max-w-[320px] items-center justify-center rounded-[1.6rem] bg-white/70 p-4 shadow-inner">
                    {heroProduct?.image_url ? (
                      <Image src={heroProduct.image_url} alt={heroProduct.name} fill className="object-contain p-6" />
                    ) : (
                      <div className="text-center text-sm text-muted-foreground">Hero product</div>
                    )}
                  </div>
                </div>
              </section>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <PromoBanner title="Catch big deals on CCTV kits" subtitle="Catalog promo" accent="bg-cyan-400" />
                <PromoBanner title="Accessories, mounts and recorders" subtitle="Catalog promo" accent="bg-yellow-400" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <PromoBanner title="Camera IP deals" subtitle="Catalog sale" accent="bg-cyan-400" />
            <PromoBanner title="Professional monitoring gear" subtitle="Catalog sale" accent="bg-primary" />
            <PromoBanner title="Audio, sensors and support" subtitle="Catalog sale" accent="bg-yellow-400" />
          </div>
        </section>

        <section className="container mx-auto px-4 pt-8">
          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="rounded-[1.75rem] border border-yellow-400 bg-card shadow-sm">
              <div className="border-b border-yellow-400/60 px-5 py-4">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Special Offer</p>
              </div>
              <div className="p-5">
                <div className="relative mx-auto aspect-square max-w-[180px] overflow-hidden rounded-2xl bg-muted">
                  {centerShowcase?.image_url ? (
                    <Image src={centerShowcase.image_url} alt={centerShowcase.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                      Publicá más productos desde el dashboard para activar esta vitrina.
                    </div>
                  )}
                </div>
                {centerShowcase ? (
                  <>
                    <p className="mt-4 line-clamp-2 text-sm font-semibold text-slate-900">{centerShowcase.name}</p>
                    <p className="mt-2 text-3xl font-black text-primary">{formatPrice(centerShowcase.price)}</p>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-sm font-semibold text-slate-900">Vitrina sin producto destacado</p>
                    <p className="mt-2 text-sm text-muted-foreground">El dashboard todavía no expuso un segundo producto para esta sección.</p>
                  </>
                )}
                <div className="mt-5 rounded-2xl bg-muted/70 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Hurry up</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-900">
                    <div className="rounded-xl bg-white px-2 py-3">00<br />Days</div>
                    <div className="rounded-xl bg-white px-2 py-3">00<br />Hrs</div>
                    <div className="rounded-xl bg-white px-2 py-3">00<br />Min</div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 border-b border-border/70 pb-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-slate-900">
                  <span className="border-b-2 border-yellow-400 pb-2">Featured</span>
                  <span className="text-muted-foreground">On Sale</span>
                  <span className="text-muted-foreground">Top Rated</span>
                </div>
                <Link href="#catalogo" className="text-sm font-semibold text-primary">See more</Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {topRow.map((product) => (
                  <ProductThumb key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pt-8">
          <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
              <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-slate-900">
                <span className="border-b-2 border-yellow-400 pb-2">Best Deals</span>
                <span className="text-muted-foreground">TV & Video</span>
                <span className="text-muted-foreground">Cameras</span>
                <span className="text-muted-foreground">Audio</span>
                <span className="text-muted-foreground">Accessories</span>
              </div>
              <Link href="#catalogo" className="text-sm font-semibold text-primary">Browse catalog</Link>
            </div>

            <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_220px]">
              <div className="space-y-4">
                {editorialLeft.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>

              <div className="rounded-[1.8rem] border border-yellow-400/60 bg-[linear-gradient(180deg,#ffffff_0%,#fffdf4_100%)] p-6 shadow-inner">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Main pick</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-900">{centerShowcase?.name || "Somme featured device"}</h3>
                  </div>
                  <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-950">New</span>
                </div>
                <div className="relative mx-auto aspect-[4/3] max-w-[340px] overflow-hidden rounded-2xl bg-muted">
                  {centerShowcase?.image_url ? (
                    <Image src={centerShowcase.image_url} alt={centerShowcase.name} fill className="object-contain p-6" />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                      Destacado sin asignar
                    </div>
                  )}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Price</p>
                    {centerShowcase ? (
                      <p className="mt-1 text-3xl font-black text-primary">{formatPrice(centerShowcase.price)}</p>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-slate-500">Esperando publicación del dashboard</p>
                    )}
                  </div>
                  <Link href="#catalogo" className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950">
                    View details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {editorialRight.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pt-8">
          <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-900">Bestsellers</p>
                <p className="mt-1 text-sm text-muted-foreground">Compact cards inspired by electronics store layout.</p>
              </div>
              <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Top 20</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
              {bestSellers.map((product) => (
                <ProductThumb key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pt-8">
          <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#eef4ff_0%,#fff7d6_100%)] p-8 shadow-sm">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Shop and save big</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900 lg:text-4xl">Landing estilo electronics store, adaptada para Somme Thechnologhy.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">Mismo enfoque comercial del modelo que pasaste: mucha densidad visual, modulos de producto, promos, marcas y bloques que parecen tienda real.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"><Truck className="h-4 w-4 text-primary" /> Shipping ready</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"><ShieldCheck className="h-4 w-4 text-primary" /> Purchase trust</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"><Zap className="h-4 w-4 text-primary" /> Fast decisions</span>
                </div>
              </div>
              <div className="rounded-[1.8rem] bg-white p-6 shadow-lg">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Limited price</p>
                <p className="mt-3 text-5xl font-black text-primary">$799</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Usa este bloque como banner de campana, promo de categoria o llamada fuerte a conversion.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pt-8">
          <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-900">Recently viewed style row</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Clock3 className="h-4 w-4" /> Updated from product feed</div>
            </div>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
              {recent.map((product) => (
                <ProductThumb key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pt-8">
          <div className="grid gap-3 rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm md:grid-cols-5">
            {[
              "themeforest",
              "graphicriver",
              "codecanyon",
              "audiojungle",
              "activeden",
            ].map((brand) => (
              <div key={brand} className="flex items-center justify-center rounded-2xl border border-dashed border-border px-4 py-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                {brand}
              </div>
            ))}
          </div>
        </section>

        <section id="catalogo" className="container mx-auto px-4 pt-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
                <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-slate-900">
                  <span className="border-b-2 border-yellow-400 pb-2">Featured Products</span>
                  <span className="text-muted-foreground">Onsale Products</span>
                  <span className="text-muted-foreground">Top Rated Products</span>
                </div>
                <Link href="#catalogo" className="text-sm font-semibold text-primary">All products</Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.slice(0, 9).map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,#f4f7ff_0%,#ffffff_100%)] p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Customer care</p>
              <h3 className="mt-3 text-2xl font-black text-slate-900">Need help building the perfect setup?</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">Este lateral reemplaza el ad/banner del template original y lo trae a tu negocio real: soporte, confianza y conversion.</p>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><Headphones className="h-4 w-4 text-primary" /> Technical support</p></div>
                <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><TicketPercent className="h-4 w-4 text-primary" /> Weekly deals</p></div>
                <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><Star className="h-4 w-4 text-primary" /> Marketplace layout</p></div>
              </div>
              <Link href="#catalogo" className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950">
                Shop products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  )
}
