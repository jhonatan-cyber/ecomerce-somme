import { CartButton } from "./cart-button"
import Link from "next/link"
import { Store } from "lucide-react"

export function StoreHeader() {
  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-2xl hover:opacity-80 transition-opacity">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <Store className="h-7 w-7" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TechStore</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Productos
          </Link>
          <Link href="/cart" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Carrito
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  )
}
