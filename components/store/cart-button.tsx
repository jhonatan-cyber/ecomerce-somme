"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export function CartButton() {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <Button
      asChild
      variant="outline"
      className="relative h-11 rounded-2xl border-border/70 bg-card px-4 shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
    >
      <Link href="/cart" className="gap-2">
        <ShoppingCart className="h-5 w-5" />
        <span className="hidden text-sm font-semibold sm:inline">Carrito</span>
        {itemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground shadow-md">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
