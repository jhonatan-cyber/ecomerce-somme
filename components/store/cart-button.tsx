"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export function CartButton() {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <Button asChild variant="outline" className="relative bg-transparent">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
