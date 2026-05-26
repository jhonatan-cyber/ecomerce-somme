"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BadgePercent, Home, ShoppingCart, Tags, Shapes } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0))

  const links = [
    { href: "/categories", label: "Categorías", icon: Shapes },
    { href: "/brands", label: "Marcas", icon: Tags },
    { href: "/", label: "", icon: Home, center: true },
    { href: "/promotions", label: "Promos", icon: BadgePercent },
    { href: "/cart", label: "Carrito", icon: ShoppingCart, badge: itemCount },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegación inferior"
    >
      <ul className="mx-auto grid h-20 max-w-3xl grid-cols-5 px-2">
        {links.map((link) => {
          const active = isActive(pathname, link.href)
          const Icon = link.icon

          return (
            <li key={link.href} className="flex items-center justify-center">
              <Link
                href={link.href}
                className={`relative flex w-full flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold transition ${
                  link.center
                    ? active
                      ? "text-white"
                      : "text-foreground"
                    : active
                      ? "text-primary"
                      : "text-muted-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.center ? (
                  <span
                    className={`absolute -top-6 flex h-14 w-14 items-center justify-center rounded-full border shadow-lg transition ${
                      active
                        ? "border-primary/70 bg-primary text-white shadow-primary/30"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                ) : (
                  <Icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                )}

                <span className={link.center ? "mt-6" : ""}>{link.label}</span>

                {"badge" in link && typeof link.badge === "number" && link.badge > 0 ? (
                  <span className="absolute right-4 top-1.5 min-w-5 rounded-full bg-primary px-1.5 text-center text-[10px] font-black text-white">
                    {link.badge > 99 ? "99+" : String(link.badge)}
                  </span>
                ) : null}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

