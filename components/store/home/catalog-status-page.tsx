import Link from "next/link"
import { AlertTriangle, ArrowRight, PackageSearch, ShieldCheck } from "lucide-react"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"

interface CatalogStatusPageProps {
  badge: string
  title: string
  message: string
  actionLabel: string
}

export function CatalogStatusPage({
  badge,
  title,
  message,
  actionLabel,
}: CatalogStatusPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="container mx-auto flex min-h-[calc(100vh-180px)] items-center px-4 py-16">
        <div className="mx-auto grid w-full max-w-3xl gap-8 rounded-[2rem] border border-border/70 bg-card p-8 shadow-sm lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20">
            <PackageSearch className="h-9 w-9" />
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-primary">{badge}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{message}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-slate-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Sin catalogo fantasma
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-slate-800">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Fuente real desde el dashboard
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-300">
                {actionLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/cart" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-muted/60">
                Ir al carrito
              </Link>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
