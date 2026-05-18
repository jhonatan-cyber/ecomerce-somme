import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Carrito de Compras | Somme Technology",
  description: "Revisá los productos en tu carrito antes de finalizar tu compra.",
  robots: { index: false },
  alternates: { canonical: "/cart" },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
