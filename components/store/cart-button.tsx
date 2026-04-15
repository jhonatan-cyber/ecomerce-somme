"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"

export function CartButton() {
  const [isMounted, setIsMounted] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Button
      asChild
      variant="outline"
      className="relative h-9 rounded-[1rem] border-border/70 bg-card px-3 shadow-sm transition hover:border-primary/40 hover:bg-primary/5 md:h-10"
    >
      <Link href="/cart" className="gap-2">
        <ShoppingCart className="h-4.5 w-4.5" />
        <span className="hidden text-sm font-semibold sm:inline">Carrito</span>
        {isMounted && itemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-md md:h-6 md:min-w-6 md:px-1.5 md:text-xs">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
