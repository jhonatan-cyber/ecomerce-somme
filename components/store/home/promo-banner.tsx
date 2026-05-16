"use client"

import { ArrowRight, Megaphone, Wrench } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { AdCarousel } from "./ad-carousel"

interface AdSlide {
  url: string
  alt: string
}

interface PromoBannerProps {
  ads?: AdSlide[]
}

function areAdsEqual(a: AdSlide[], b: AdSlide[]) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i]?.url !== b[i]?.url || a[i]?.alt !== b[i]?.alt) return false
  }
  return true
}

export function PromoBanner({ ads = [] }: PromoBannerProps) {
  const [liveAds, setLiveAds] = useState<AdSlide[]>(ads)
  const refreshInFlightRef = useRef(false)

  useEffect(() => {
    setLiveAds((prev) => (areAdsEqual(prev, ads) ? prev : ads))
  }, [ads])

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2"
    if (!key) return

    let cancelled = false
    let cleanup = () => {}

    const refreshAds = async () => {
      if (refreshInFlightRef.current) return
      refreshInFlightRef.current = true
      try {
        const res = await fetch("/api/store/ads", { cache: "no-store" })
        if (!res.ok) return
        const payload = (await res.json()) as { data?: AdSlide[] }
        if (!cancelled && Array.isArray(payload.data)) {
          setLiveAds((prev) => (areAdsEqual(prev, payload.data ?? []) ? prev : (payload.data ?? [])))
        }
      } catch {
        // noop
      } finally {
        refreshInFlightRef.current = false
      }
    }

    ;(async () => {
      const PusherModule = await import("pusher-js")
      if (cancelled) return
      const Pusher = PusherModule.default
      const pusher = new Pusher(key, { cluster })
      const channel = pusher.subscribe("storefront-ads-channel")
      const syncChannel = pusher.subscribe("storefront-sync-channel")
      const handler = () => void refreshAds()
      const syncHandler = (payload: { resource?: string }) => {
        if (payload?.resource === "ads") void refreshAds()
      }
      channel.bind("ads-updated", handler)
      syncChannel.bind("storefront-content-updated", syncHandler)

      cleanup = () => {
        channel.unbind("ads-updated", handler)
        syncChannel.unbind("storefront-content-updated", syncHandler)
        pusher.unsubscribe("storefront-ads-channel")
        pusher.unsubscribe("storefront-sync-channel")
        pusher.disconnect()
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/store/ads", { cache: "no-store" })
        if (!res.ok) return
        const payload = (await res.json()) as { data?: AdSlide[] }
        if (Array.isArray(payload.data)) {
          setLiveAds((prev) => (areAdsEqual(prev, payload.data ?? []) ? prev : (payload.data ?? [])))
        }
      } catch {
        // noop
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="container mx-auto px-4 pt-10">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-10">
        {/* Left: Technician discount */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 shadow-xl lg:col-span-4">
          {/* Subtle accent glow */}
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/8 blur-3xl" />

          <div className="relative flex h-full flex-col gap-5 p-6 sm:p-7 lg:p-8">
            {/* Pill badge + circle percentage */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
                <Wrench className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  Descuento técnico
                </span>
              </div>
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 sm:h-24 sm:w-24">
                <div className="text-center leading-none">
                  <span className="block text-2xl font-black text-white sm:text-3xl">15</span>
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.3em] text-emerald-400">% OFF</span>
                </div>
              </div>
            </div>

            {/* Title + description */}
            <div>
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Descuento exclusivo para instaladores
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                Si trabajás en el sector de seguridad electrónica, accedé a precios preferenciales en todo nuestro catálogo de cámaras, NVRs y accesorios.
              </p>
            </div>

            {/* Feature bullets */}
            <ul className="space-y-1.5">
              {[
                "15% de descuento en tu compra",
                "Atención personalizada por WhatsApp",
                "Envío a todo Bolivia",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 shrink-0 text-emerald-400">&#x2022;</span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-auto text-[11px] text-slate-500">
              * Aplican términos y condiciones
            </p>
          </div>
        </div>

        {/* Right: Fallback advertising card */}
        {liveAds.length > 0 ? (
          <div className="h-full overflow-hidden rounded-[2rem] shadow-xl lg:col-span-6">
            <AdCarousel ads={liveAds} />
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-950 via-slate-900 to-slate-950 shadow-xl lg:col-span-6">
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

                <div className="mt-5 inline-flex items-center rounded-full border border-emerald-300/20 bg-black/20 px-3 py-1.5">
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

