import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Truck, Youtube } from "lucide-react"

const quickLinks = [
  { href: "/#destacados", label: "Destacados" },
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/cart", label: "Carrito" },
  { href: "/checkout", label: "Checkout" },
]

const categories = ["Cámaras IP", "Kits CCTV", "NVR / DVR", "Accesorios"]

export function StoreFooter() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-3">
            <div className="rounded-2xl bg-primary p-3 text-primary-foreground shadow-lg shadow-primary/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="bg-gradient-to-r from-cyan-300 via-blue-400 to-primary bg-clip-text text-2xl font-black text-transparent">
                Somme Thechnologhy
              </p>
              <p className="text-sm text-slate-400">Seguridad electrónica y e-commerce de alto impacto.</p>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
            Inspirado en la lógica de un marketplace de electrónica moderno: navegación clara, catálogo vendible y una experiencia lista para escalar campañas, tráfico y conversión.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-1.5">
              <Truck className="h-4 w-4 text-cyan-300" /> Despacho ágil
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-1.5">
              <ShieldCheck className="h-4 w-4 text-cyan-300" /> Compra segura
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Navegación</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-slate-300 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Categorías</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {categories.map((category) => (
              <li key={category} className="text-slate-300">
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Contacto</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-300" /> +54 11 5555 0000</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-300" /> ventas@somme-thechnologhy.com</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-300" /> Buenos Aires, Argentina</p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, index) => (
              <span key={index} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 text-slate-300">
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Somme Thechnologhy. Todos los derechos reservados.</p>
          <p>Storefront rediseñado con lógica de marketplace de electrónica.</p>
        </div>
      </div>
    </footer>
  )
}