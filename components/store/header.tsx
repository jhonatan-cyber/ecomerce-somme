"use client"

import Link from "next/link"
import Image from "next/image"
import { BadgePercent, Headphones, LayoutGrid, ShieldCheck, Store, Truck } from "lucide-react"
import { CartButton } from "./cart-button"
import { SearchPopover } from "./search-popover"
import { ThemeToggle } from "./theme-toggle"
import { TourIconButton } from "@/components/tour"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Category } from "@/lib/types"
import { defaultStoreNavigationCategories, type StoreNavigationCategory } from "@/lib/store-navigation"

export function StoreHeader({
  currentSearch: _currentSearch = "",
  categories = defaultStoreNavigationCategories,
  brands: _brands = [],
}: {
  currentSearch?: string
  categories?: (StoreNavigationCategory | Category)[]
  brands?: { id: string; name: string; logo: string | null }[]
}) {
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

      <div className="container mx-auto px-3 py-2 md:px-4 md:py-3">
        <div className="grid items-center gap-2 lg:rounded-[1.7rem] lg:border lg:border-border/70 lg:bg-card/85 lg:px-4 lg:py-3 lg:shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] lg:backdrop-blur xl:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" data-tour="header-logo" className="group min-w-0 flex-1 transition hover:opacity-90">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.webp"
                  alt="Somme Technology"
                  width={40}
                  height={40}
                  className="h-8 w-8 rounded-xl object-contain transition group-hover:scale-[1.03] lg:h-10 lg:w-10"
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
            </div>
          </div>

          <div className="flex flex-col gap-1.5 lg:hidden">
            <div className="overflow-hidden rounded-[1.15rem] border border-border bg-background/80 shadow-inner">
              <SearchPopover variant="compact" />
            </div>
          </div>

          <div data-tour="search-bar" className="hidden lg:block">
            <SearchPopover />
          </div>

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
      </div>
    </header>
  )
}
