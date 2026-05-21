"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart, ShoppingBag, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { StoreImage } from "@/components/store/store-image"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"

export function CartButton() {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore((state) => state.getItemCount())
  const total = useCartStore((state) => state.getTotal())
  const removeItem = useCartStore((state) => state.removeItem)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative h-9 rounded-[1rem] border-border/70 bg-card px-3 shadow-sm transition hover:border-primary/40 hover:bg-primary/5 md:h-10"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          <span className="hidden text-sm font-semibold sm:inline">Carrito</span>
          {isMounted && itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-md md:h-6 md:min-w-6 md:px-1.5 md:text-xs">
              {itemCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-80 p-0">
        <div className="p-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Carrito ({itemCount})
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-3 pb-4 pt-2">
            <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 space-y-1 overflow-y-auto px-3">
              {items.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-muted/50">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.quantity} x BOB {item.price.toLocaleString("es-BO")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-muted-foreground/60 transition hover:text-destructive"
                    aria-label="Quitar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {items.length > 4 && (
                <p className="py-1 text-center text-[11px] text-muted-foreground">
                  +{items.length - 4} producto{items.length - 4 !== 1 ? "s" : ""} más
                </p>
              )}
            </div>

            <div className="border-t border-border/60 px-3 py-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-base font-black">BOB {total.toLocaleString("es-BO")}</span>
              </div>
              <Button
                asChild
                className="h-9 w-full rounded-xl bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] text-xs font-bold text-white hover:opacity-90"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/checkout">Ir al checkout</Link>
              </Button>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="mt-2 flex items-center justify-center text-xs font-semibold text-muted-foreground transition hover:text-primary"
              >
                Ver carrito completo
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
