import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Truck, Youtube } from "lucide-react"

export function StoreFooter() {
  return (
    <footer className="mt-12 border-t border-slate-900/80 bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-slate-200 sm:mt-20">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Brand block — full width on mobile */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_65%,#22d3ee_100%)] p-2.5 text-white shadow-lg shadow-cyan-500/20 sm:rounded-2xl sm:p-3">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="bg-gradient-to-r from-cyan-300 via-blue-400 to-primary bg-clip-text text-xl font-black text-transparent sm:text-2xl">
                Somme Technology
              </p>
              <p className="text-xs text-slate-400 sm:text-sm">Seguridad electrónica · Cochabamba, Bolivia</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-400 sm:mt-5 sm:max-w-md">
            Tienda especializada en videovigilancia y seguridad electrónica. Productos reales, asesoramiento técnico y despacho coordinado.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300 sm:mt-6 sm:gap-3 sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5">
              <Truck className="h-3.5 w-3.5 text-cyan-300" /> Despacho ágil
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> Compra segura
            </span>
          </div>
        </div>

        {/* Contact — horizontal on mobile */}
        <div className="border-t border-slate-800/60 pt-6 sm:pt-8">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Contacto</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-cyan-300" />
              +591 79960578
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-cyan-300" />
              edgarmartinez@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-cyan-300" />
              Cochabamba, Bolivia
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, index) => (
              <span
                key={index}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 transition hover:border-cyan-400/40 hover:text-white sm:h-10 sm:w-10 sm:rounded-2xl"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/90">
        <div className="container mx-auto flex flex-col gap-1 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <p>© 2026 Somme Technology. Todos los derechos reservados.</p>
          <p>Cochabamba, Bolivia · Seguridad electrónica</p>
        </div>
      </div>
    </footer>
  )
}
