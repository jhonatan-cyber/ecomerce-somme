"use client"

import Link from "next/link"
import { Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react"
import { StoreFooter } from "@/components/store/footer"
import { StoreHeader } from "@/components/store/header"
import { StoreImage } from "@/components/store/store-image"
import { Button } from "@/components/ui/button"
import { AutoTour } from "@/components/tour"
import { useCartStore } from "@/lib/store/cart-store"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm sm:rounded-[2rem] sm:p-10">
            <ShoppingBag className="mx-auto h-14 w-14 text-muted-foreground sm:h-20 sm:w-20" />
            <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">Tu carrito está vacío</h1>
            <p className="mt-3 text-sm text-muted-foreground">Todavía no agregaste productos. Volvé al catálogo y explorá.</p>
            <Button asChild className="mt-6 w-full rounded-xl sm:w-auto sm:rounded-2xl sm:px-6">
              <Link href="/catalog">Explorar productos</Link>
            </Button>
          </div>
        </main>
        <StoreFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AutoTour page="cart" delay={1000} />
      <StoreHeader />
      <main className="container mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Tu compra</p>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">Carrito</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} producto{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1.35fr_0.65fr]">
          {/* Items */}
          <div data-tour="cart-items" className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3 sm:gap-4 sm:p-4">
                {/* Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-24">
                  <StoreImage
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    fallbackText=""
                    showFallbackIcon={false}
                    fallbackClassName="bg-muted"
                  />
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h2 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                    {item.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">${item.price.toLocaleString()} c/u</p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                    {/* Quantity */}
                    <div className="inline-flex items-center rounded-xl border bg-background">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-l-xl hover:bg-muted/60"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-r-xl hover:bg-muted/60"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Subtotal + remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-foreground">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive/70 transition hover:text-destructive"
                        aria-label="Quitar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div data-tour="cart-summary">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:sticky lg:top-28 sm:rounded-[2rem] sm:p-6">
              <h2 className="text-lg font-black tracking-tight sm:text-2xl">Resumen</h2>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${getTotal().toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-semibold text-emerald-600">A coordinar</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-black">${getTotal().toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2 rounded-xl bg-slate-950 p-4 text-xs text-slate-300">
                <p className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-cyan-300" /> Envío coordinado</p>
                <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> Compra segura</p>
              </div>
              <Button data-tour="checkout-button" asChild className="mt-4 h-11 w-full rounded-xl sm:h-12 sm:rounded-2xl">
                <Link href="/checkout">Ir al checkout →</Link>
              </Button>
              <Link
                href="/catalog"
                className="mt-3 flex items-center justify-center text-xs font-semibold text-muted-foreground transition hover:text-primary"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
