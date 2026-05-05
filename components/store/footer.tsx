import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Truck, Youtube } from "lucide-react"

// TikTok icon component (lucide-react doesn't have TikTok yet)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

export function StoreFooter() {
  return (
    <footer className="mt-12 border-t border-slate-900/80 bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-slate-200 sm:mt-20">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Grid layout: Brand left, Contact right */}
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
          {/* Brand block */}
          <div>
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

          {/* Contact block */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Contacto</h3>
            <div className="space-y-3 text-sm text-slate-300">
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
              {[
                { Icon: Facebook, label: "Facebook", hoverColor: "hover:bg-[#1877F2] hover:border-[#1877F2]" },
                { Icon: Instagram, label: "Instagram", hoverColor: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737] hover:border-transparent" },
                { Icon: TikTokIcon, label: "TikTok", hoverColor: "hover:bg-black hover:border-black" },
                { Icon: Youtube, label: "YouTube", hoverColor: "hover:bg-[#FF0000] hover:border-[#FF0000]" },
              ].map(({ Icon, label, hoverColor }, index) => (
                <span
                  key={index}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 transition hover:text-white sm:h-10 sm:w-10 sm:rounded-2xl ${hoverColor}`}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/90">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <p>© 2026 Somme Technology. Todos los derechos reservados.</p>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center gap-3">
              <a href="/privacy" className="transition hover:text-slate-300">Privacidad</a>
              <span>·</span>
              <a href="/cookies" className="transition hover:text-slate-300">Cookies</a>
              <span>·</span>
              <a href="/terms" className="transition hover:text-slate-300">Términos</a>
            </div>
            <span className="hidden sm:inline">·</span>
            <p className="text-slate-600">
              Desarrollado por{" "}
              <a
                href="https://nuwesoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-400 transition hover:text-cyan-400 hover:underline"
              >
                Nuwesoft
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
