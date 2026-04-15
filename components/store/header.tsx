"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BadgePercent,
  Headphones,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  X,
} from "lucide-react"
import { CartButton } from "./cart-button"
import { ThemeToggle } from "./theme-toggle"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import {
  defaultStoreNavigationCategories,
  getStoreCategoryHref,
  type StoreNavigationCategory,
} from "@/lib/store-navigation"

const primaryLinks = [
  { href: "/#destacados", label: "Ofertas" },
  { href: "/catalog", label: "Tienda" },
  { href: "/brands", label: "Marcas" },
  { href: "/cart", label: "Carrito" },
]

export function StoreHeader({
  currentSearch = "",
  categories = defaultStoreNavigationCategories,
  brands = [],
}: {
  currentSearch?: string
  categories?: StoreNavigationCategory[]
  brands?: { id: string; name: string; logo: string | null }[]
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
      <div className="border-b border-cyan-400/10 bg-slate-950 text-slate-200">
        <div className="container mx-auto flex min-h-8 items-center justify-between gap-3 px-4 py-1.5 text-[11px] md:min-h-9 md:py-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <Truck className="h-3 w-3 text-cyan-300" />
              Envios coordinados a todo el pais
            </span>
            <span className="hidden items-center gap-2 md:inline-flex">
              <ShieldCheck className="h-3 w-3 text-cyan-300" />
              Garantia y soporte especializado
            </span>
          </div>
          <div className="hidden items-center gap-3 text-slate-400 md:flex">
            <span className="inline-flex items-center gap-2">
              <Headphones className="h-3 w-3 text-cyan-300" />
              Asesoramiento tecnico
            </span>
            <span className="hidden items-center gap-2 md:inline-flex">
              <BadgePercent className="h-3 w-3 text-cyan-300" />
              Promos semanales
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2.5 md:py-3">
        <div className="grid items-center gap-3 rounded-[1.7rem] border border-border/70 bg-card/85 px-3 py-3 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur xl:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4 lg:px-4 lg:py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="group min-w-0 flex-1 transition hover:opacity-90" onClick={closeMobileMenu}>
              <div className="flex items-center gap-3">
                <div className="rounded-[1.1rem] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_65%,#22d3ee_100%)] p-2.5 text-white shadow-lg shadow-cyan-500/20 transition group-hover:scale-[1.03]">
                  <Store className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate bg-gradient-to-r from-slate-950 via-blue-700 to-cyan-500 bg-clip-text text-lg font-black text-transparent sm:text-xl">
                    Somme Technology
                  </p>
                  <p className="hidden text-[11px] text-muted-foreground xl:block">
                    Marketplace de seguridad y electronica
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <CartButton />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
                aria-expanded={isMobileMenuOpen}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[1rem] border border-border/70 bg-card/80 shadow-sm"
              >
                {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <form action="/catalog" className="flex overflow-hidden rounded-[1.15rem] border border-border bg-background/80 shadow-inner">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="flex items-center gap-2 border-r border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-muted/50 transition-colors xl:px-4 outline-none focus:outline-none">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Categorías
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {defaultStoreNavigationCategories.map((category) => (
                    category.subcategories && category.subcategories.length > 0 ? (
                      <DropdownMenuSub key={category.id}>
                        <DropdownMenuSubTrigger>
                          <span>{category.name}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem asChild>
                              <Link href={getStoreCategoryHref(category.id)}>
                                <strong>Ver todo en {category.name}</strong>
                              </Link>
                            </DropdownMenuItem>
                            {category.subcategories.map(sub => (
                              <DropdownMenuItem key={sub.id} asChild>
                                <Link href={getStoreCategoryHref(category.id, sub.id)}>
                                  {sub.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    ) : (
                      <DropdownMenuItem key={category.id} asChild>
                        <Link href={getStoreCategoryHref(category.id)}>
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    )
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="search"
                  defaultValue={currentSearch}
                  className="h-11 border-0 bg-transparent pl-10 pr-4 text-sm shadow-none focus-visible:ring-0"
                  placeholder="Buscar camaras, kits, grabadores o accesorios"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Buscar
              </button>
            </form>
          </div>

          <div className="hidden items-center justify-end gap-3 lg:flex">
            <div className="hidden text-right xl:block">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Soporte comercial
              </p>
              <p className="text-sm font-bold">+54 11 5555 0000</p>
            </div>
            <ThemeToggle />
            <CartButton />
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-3 rounded-[1.5rem] border border-border/70 bg-card/95 p-4 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:hidden">
            <form action="/catalog" className="mb-4 space-y-3" onSubmit={closeMobileMenu}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="search"
                  defaultValue={currentSearch}
                  className="h-10 rounded-[1rem] border-border bg-background pl-10 pr-4 text-sm"
                  placeholder="Buscar camaras, kits o accesorios"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Buscar
              </button>
            </form>

            <nav className="grid gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-[1rem] border border-border/70 bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-border/70 pt-4 text-xs text-muted-foreground">
              Las categorias principales se exploran desde la columna izquierda del catalogo.
            </div>
          </div>
        ) : null}

        <div className="mt-3 hidden items-center justify-between gap-6 border-t border-border/70 pt-3 lg:flex">
          <nav className="flex items-center gap-6">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-semibold text-muted-foreground transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs font-medium text-muted-foreground">
            Explora categorias desde la columna izquierda del catalogo
          </p>
        </div>
      </div>
    </header>
  )
}
