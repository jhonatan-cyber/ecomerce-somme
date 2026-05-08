import type { Metadata } from "next"
import CartClient from "./cart-client"

export const metadata: Metadata = {
  title: "Carrito de Compras",
  description: "Revisá los productos seleccionados en tu carrito de compras. Cámaras IP, grabadores NVR, kits de seguridad y más.",
  alternates: { canonical: "/cart" },
  openGraph: {
    title: "Carrito de Compras | Somme Technology",
    description: "Revisá tu carrito de compras",
    url: "/cart",
    type: "website",
  },
}

export default function CartPage() {
  return <CartClient />
}
