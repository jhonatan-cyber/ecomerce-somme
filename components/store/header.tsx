"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BadgePercent,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Headphones,
  Menu,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  X,
} from "lucide-react"
import { CartButton } from "./cart-button"
import { SearchPopover } from "./search-popover"
import { ThemeToggle } from "./theme-toggle"
import { TourIconButton } from "@/components/tour"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  defaultStoreNavigationCategories,
  type StoreNavigationCategory,
} from "@/lib/store-navigation"
import type { Category } from "@/lib/types"

const primaryLinks = [
  { href: "/promotions", label: "Ofertas" },
  { href: "/catalog", label: "Tienda" },
  { href: "/categories", label: "Categorias" },
  { href: "/brands", label: "Marcas" },
  { href: "/tracking", label: "Tracking" },
]

type MobilePanel = "categories" | "brands" | null

export function StoreHeader({
  currentSearch = "",
  categories = defaultStoreNavigationCategories,
  brands = [],
}: {
  currentSearch?: string
  categories?: (StoreNavigationCategory | Category)[]
  brands?: { id: string; name: string; logo: string | null }[]
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [mobileCategorySearch, setMobileCategorySearch] = useState("")
  const [mobileBrandSearch, setMobileBrandSearch] = useState("")

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setMobilePanel(null)
    setExpandedCategory(null)
  }

  const togglePanel = (panel: MobilePanel) => {
    setMobilePanel((prev) => (prev === panel ? null : panel))
    setExpandedCategory(null)
  }

  // Normalize categories — support both StoreNavigationCategory and Category types
  const normalizedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    children:
      "children" in c && c.children
        ? c.children
        : "subcategories" in c && (c as StoreNavigationCategory).subcategories
          ? (c as StoreNavigationCategory).subcategories
          : undefined,
  }))
  const normalizedCategorySearch = mobileCategorySearch.trim().toLowerCase()
  const normalizedBrandSearch = mobileBrandSearch.trim().toLowerCase()
  const filteredMobileCategories = normalizedCategorySearch
    ? normalizedCategories.filter((category) => {
        const categoryMatches = category.name.toLowerCase().includes(normalizedCategorySearch)
        const childMatches =
          category.children?.some((child) =>
            child.name.toLowerCase().includes(normalizedCategorySearch),
          ) ?? false
        return categoryMatches || childMatches
      })
    : normalizedCategories
  const filteredMobileBrands = normalizedBrandSearch
    ? brands.filter((brand) => brand.name.toLowerCase().includes(normalizedBrandSearch))
    : brands

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
      {/* Top bar */}
      {/* Top bar */}
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

      <div className="container mx-auto px-3 py-2 md:px-4 md:py-3">
        <div className="grid items-center gap-2 lg:rounded-[1.7rem] lg:border lg:border-border/70 lg:bg-card/85 lg:px-4 lg:py-3 lg:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] lg:backdrop-blur xl:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4">

          {/* Logo + mobile actions */}
          <div className="flex items-center gap-3">
            <Link href="/" data-tour="header-logo" className="group min-w-0 flex-1 transition hover:opacity-90" onClick={closeMobileMenu}>
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.webp"
                  alt="Somme Technology"
                  width={40}
                  height={40}
                  className="h-8 w-8 rounded-xl lg:h-10 lg:w-10 object-contain transition group-hover:scale-[1.03]"
                  unoptimized
                />
                <div className="min-w-0">
                  <p className="truncate bg-gradient-to-r from-slate-950 via-blue-700 to-cyan-500 bg-clip-text text-base font-black text-transparent sm:text-xl">
                    Somme Technology
                  </p>
                  <p className="hidden text-[11px] text-muted-foreground xl:block">
                    Proyectos y Servicios Tecnologicos
                  </p>
                </div>
              </div>
            </Link>

            <div className="relative z-50 flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <CartButton />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
                aria-expanded={isMobileMenuOpen}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[1rem] border border-border/70 bg-card/80 shadow-sm pointer-events-auto relative z-50"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile: search + category/brand buttons */}
          <div className="flex flex-col gap-1.5 lg:hidden">
            <div className="overflow-hidden rounded-[1.15rem] border border-border bg-background/80 shadow-inner">
              <SearchPopover variant="compact" />
            </div>

            {/* Category / Brand toggle buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => togglePanel("categories")}
                className={`flex items-center justify-center gap-1.5 rounded-[0.9rem] border px-3 py-2 text-xs font-semibold transition ${mobilePanel === "categories"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/70 bg-background text-foreground hover:border-primary/30 hover:text-primary"
                  }`}
              >
                Categorías
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${mobilePanel === "categories" ? "rotate-180" : ""
                    }`}
                />
              </button>
              <button
                type="button"
                onClick={() => togglePanel("brands")}
                className={`flex items-center justify-center gap-1.5 rounded-[0.9rem] border px-3 py-2 text-xs font-semibold transition ${mobilePanel === "brands"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/70 bg-background text-foreground hover:border-primary/30 hover:text-primary"
                  }`}
              >
                Marcas
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${mobilePanel === "brands" ? "rotate-180" : ""
                    }`}
                />
              </button>
            </div>

            {/* Categories panel */}
            {mobilePanel === "categories" && (
              <div className="max-h-[60vh] overflow-y-auto overscroll-contain rounded-[1.25rem] border border-border/70 bg-card shadow-md">
                <div className="sticky top-0 z-10 border-b border-border/60 bg-card/95 p-3 backdrop-blur">
                  <div className="relative">
                    <Input
                      value={mobileCategorySearch}
                      onChange={(event) => setMobileCategorySearch(event.target.value)}
                      placeholder="Buscar categoria..."
                      className="h-9 rounded-xl border-border/70 bg-background pr-9 text-sm"
                      aria-label="Buscar categoria"
                    />
                    {mobileCategorySearch && (
                      <button
                        type="button"
                        onClick={() => setMobileCategorySearch("")}
                        className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Limpiar busqueda de categorias"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {filteredMobileCategories
                  .filter((c) => !("parentId" in c) || !(c as any).parentId)
                  .map((category) => {
                    const hasChildren = category.children && category.children.length > 0
                    const isExpanded = expandedCategory === category.id
                    const visibleChildren =
                      hasChildren && normalizedCategorySearch
                        ? category.children!.filter((sub) =>
                            sub.name.toLowerCase().includes(normalizedCategorySearch),
                          )
                        : category.children ?? []

                    return (
                      <div key={category.id} className="border-b border-border/50 last:border-0">
                        {hasChildren ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedCategory(isExpanded ? null : category.id)
                              }
                              className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/50"
                            >
                              {category.name}
                              <ChevronRight
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""
                                  }`}
                              />
                            </button>
                            {isExpanded && (
                              <div className="border-t border-border/40 bg-muted/30 pb-1">
                                <Link
                                  href={`/catalog?category=${encodeURIComponent(category.id)}`}
                                  onClick={closeMobileMenu}
                                  className="block px-7 py-2.5 text-xs font-bold text-foreground transition hover:text-primary"
                                >
                                  Ver todo en {category.name}
                                </Link>
                                {visibleChildren.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    href={`/catalog?category=${encodeURIComponent(category.id)}&subcategory=${encodeURIComponent(sub.id)}`}
                                    onClick={closeMobileMenu}
                                    className="block px-7 py-2.5 text-xs text-muted-foreground transition hover:text-primary"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            href={`/catalog?category=${encodeURIComponent(category.id)}`}
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/50 hover:text-primary"
                          >
                            {category.name}
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        )}
                      </div>
                    )
                  })}
                {filteredMobileCategories.filter((c) => !("parentId" in c) || !(c as any).parentId).length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground">Sin categorias para esa busqueda.</p>
                )}
              </div>
            )}

            {/* Brands panel */}
            {mobilePanel === "brands" && (
              <div className="max-h-[60vh] overflow-y-auto overscroll-contain rounded-[1.25rem] border border-border/70 bg-card shadow-md">
                <div className="sticky top-0 z-10 border-b border-border/60 bg-card/95 p-3 backdrop-blur">
                  <div className="relative">
                    <Input
                      value={mobileBrandSearch}
                      onChange={(event) => setMobileBrandSearch(event.target.value)}
                      placeholder="Buscar marca..."
                      className="h-9 rounded-xl border-border/70 bg-background pr-9 text-sm"
                      aria-label="Buscar marca"
                    />
                    {mobileBrandSearch && (
                      <button
                        type="button"
                        onClick={() => setMobileBrandSearch("")}
                        className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Limpiar busqueda de marcas"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {brands.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">Sin marcas disponibles.</p>
                ) : filteredMobileBrands.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">Sin marcas para esa busqueda.</p>
                ) : (
                  <>
                    <Link
                      href="/catalog"
                      onClick={closeMobileMenu}
                      className="flex items-center border-b border-border/50 px-4 py-3 text-sm font-bold text-foreground transition hover:bg-muted/50 hover:text-primary"
                    >
                      Todas las marcas
                    </Link>
                    {filteredMobileBrands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/catalog?brand=${brand.id}`}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 border-b border-border/50 px-4 py-2.5 text-sm font-semibold text-foreground transition last:border-0 hover:bg-muted/50 hover:text-primary"
                      >
                        {brand.logo ? (
                          <div className="flex h-6 w-14 shrink-0 items-center overflow-hidden rounded border border-border/60 bg-white px-1">
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={48}
                              height={20}
                              className="h-4 w-auto object-contain"
                              unoptimized
                            />
                          </div>
                        ) : null}
                        {brand.name}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop search */}
          <div data-tour="search-bar" className="hidden lg:block">
            <SearchPopover />
          </div>

          {/* Desktop right actions */}
          <div className="hidden items-center justify-end gap-3 lg:flex">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Link
                  href="/promotions"
                  className="inline-flex items-center gap-1.5 rounded-[1rem] border border-border/70 bg-card/80 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition hover:border-primary/40 hover:text-primary"
                >
                  <BadgePercent className="h-3.5 w-3.5" />
                  Ofertas
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">Ver ofertas y promociones</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1.5 rounded-[1rem] border border-border/70 bg-card/80 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition hover:border-primary/40 hover:text-primary"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Categorias
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">Ver todas las categorias</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Link
                  href="/brands"
                  className="inline-flex items-center gap-1.5 rounded-[1rem] border border-border/70 bg-card/80 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition hover:border-primary/40 hover:text-primary"
                >
                  <Store className="h-3.5 w-3.5" />
                  Marcas
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">Explorar marcas</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <span>
                  <TourIconButton page="home" className="text-muted-foreground hover:text-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">Tour interactivo</TooltipContent>
            </Tooltip>

            <ThemeToggle />

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div data-tour="cart-button">
                  <CartButton />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Ver carrito</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Mobile nav links (hamburger) */}
        {isMobileMenuOpen && (
          <div className="mt-3 rounded-[1.5rem] border border-border/70 bg-card/95 p-4 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:hidden">
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
          </div>
        )}
      </div>
    </header>
  )
}
