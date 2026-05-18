import type { Metadata } from "next"
import { TrackingForm } from "./tracking-form"

export const metadata: Metadata = {
  title: "Tracking de Pedido",
  description: "Consultá el estado de tu pedido ingresando tu código.",
  robots: { index: false },
}

export default function TrackingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm sm:rounded-[2rem] sm:p-10">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Tracking de pedido</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresá el código que te dimos al finalizar la compra.
          </p>
          <TrackingForm />
        </div>
      </main>
    </div>
  )
}
