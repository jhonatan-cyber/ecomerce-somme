import { ArrowRight, Megaphone, Wrench } from "lucide-react"
import { AdCarousel } from "./ad-carousel"

interface AdSlide {
  url: string
  alt: string
}

interface PromoBannerProps {
  ads?: AdSlide[]
}

export function PromoBanner({ ads = [] }: PromoBannerProps) {
  return (
    <section className="container mx-auto px-4 pt-10">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Left: Technician discount */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 shadow-xl">
          {/* Decorative glow */}
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />

          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10 lg:p-10">
            {/* Big percentage */}
            <div className="z-10 flex shrink-0 items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-emerald-500/20 bg-emerald-500/5 sm:h-44 sm:w-44">
                <div className="absolute inset-2 rounded-full border border-emerald-500/10" />
                <div className="text-center">
                  <span className="block text-5xl font-black text-emerald-400 sm:text-6xl">15%</span>
                  <span className="mt-1 block text-xs font-bold uppercase tracking-[0.2em] text-emerald-300/60">OFF</span>
                </div>
              </div>
            </div>

            {/* Text + CTA */}
            <div className="z-10 flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5">
                <Wrench className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Descuento técnico
                </span>
              </div>

              <h3 className="text-xl font-black text-white sm:text-2xl lg:text-3xl">
                ¿Eres técnico instalador?
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
                Obtén un descuento exclusivo en tu compra. Aplica para profesionales del sector de seguridad.
              </p>

              <div className="mt-5">
                <span className="text-xs text-slate-400">
                  * Aplican términos y condiciones
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Fallback advertising card */}
        {ads.length > 0 ? (
          <div className="h-full overflow-hidden rounded-[2rem] shadow-xl">
            <AdCarousel ads={ads} />
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-950 via-slate-900 to-slate-950 shadow-xl">
            {/* Decorative glow */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 75% 25%, white 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10 lg:p-10">
              {/* Icon decoration */}
              <div className="z-10 flex shrink-0 items-center justify-center">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-orange-500/20 bg-orange-500/5 sm:h-44 sm:w-44">
                  <div className="absolute inset-2 rounded-full border border-orange-500/10" />
                  <Megaphone className="h-16 w-16 text-orange-400 sm:h-20 sm:w-20" />
                </div>
              </div>

              {/* Text + CTA */}
              <div className="z-10 flex-1">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5">
                  <Megaphone className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
                    Publicidad
                  </span>
                </div>

                <h3 className="text-xl font-black text-white sm:text-2xl lg:text-3xl">
                  ¿Querés publicitar tu marca?
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
                  Llegá a miles de técnicos instaladores y profesionales de seguridad. Espacios publicitarios en nuestra plataforma.
                </p>

                <div className="mt-5">
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}?text=${encodeURIComponent("Hola, quiero publicitar en su página")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40"
                  >
                    Contactanos
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
