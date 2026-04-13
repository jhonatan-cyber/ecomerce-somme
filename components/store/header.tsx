import Link from "next/link"
import { BadgePercent, Headphones, Menu, Search, ShieldCheck, Sparkles, Store, Truck } from "lucide-react"
import { CartButton } from "./cart-button"
import { Input } from "@/components/ui/input"

const primaryLinks = [
  { href: "/#destacados", label: "Ofertas" },
  { href: "/#catalogo", label: "Tienda" },
  { href: "/cart", label: "Carrito" },
]

const categories = ["Cámaras IP", "Kits", "Grabadores", "Accesorios"]

export function StoreHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/85">
      <div className="border-b border-slate-800 bg-slate-950 text-slate-200">
        <div className="container mx-auto flex min-h-10 flex-col gap-2 px-4 py-2 text-xs md:flex-row md:items-center md:justify-between md:py-0">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-cyan-300" /> Envíos coordinados a todo el país</span>
            <span className="hidden items-center gap-2 md:inline-flex"><ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> Garantía y soporte especializado</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="inline-flex items-center gap-2"><Headphones className="h-3.5 w-3.5 text-cyan-300" /> Asesoramiento técnico</span>
            <span className="hidden items-center gap-2 md:inline-flex"><BadgePercent className="h-3.5 w-3.5 text-cyan-300" /> Promos semanales</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="grid items-center gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            <Link href="/" className="group flex items-center gap-3 transition hover:opacity-90">
              <div className="rounded-2xl bg-primary p-3 text-primary-foreground shadow-lg shadow-primary/20 transition group-hover:scale-[1.03]">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <p className="bg-gradient-to-r from-primary via-cyan-500 to-blue-500 bg-clip-text text-xl font-black text-transparent sm:text-2xl">Somme Thechnologhy</p>
                <p className="hidden text-xs text-muted-foreground sm:block">Marketplace de seguridad y electrónica</p>
              </div>
            </Link>
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden lg:block">
            <div className="flex overflow-hidden rounded-[1.4rem] border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 border-r border-border px-4 text-sm font-semibold text-slate-600">
                <Sparkles className="h-4 w-4 text-primary" /> Todas las categorías
              </div>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="h-14 border-0 bg-transparent pl-11 pr-4 shadow-none focus-visible:ring-0" placeholder="Buscar cámaras, kits, grabadores o accesorios" />
              </div>
              <Link href="/#catalogo" className="inline-flex items-center bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Buscar</Link>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden text-right xl:block">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Soporte comercial</p>
              <p className="text-sm font-bold">+54 11 5555 0000</p>
            </div>
            <CartButton />
          </div>
        </div>

        <div className="mt-4 hidden items-center justify-between gap-6 border-t border-border/70 pt-4 lg:flex">
          <nav className="flex items-center gap-6">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">{link.label}</Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <Link key={category} href="/#catalogo" className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary">{category}</Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}