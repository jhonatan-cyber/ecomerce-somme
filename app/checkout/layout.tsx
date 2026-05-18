import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Finalizar Compra | Somme Technology",
  description: "Completá tus datos para finalizar tu pedido.",
  robots: { index: false },
  alternates: { canonical: "/checkout" },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
