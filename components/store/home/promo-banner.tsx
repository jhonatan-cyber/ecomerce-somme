"use client"

import { ArrowRight, Megaphone } from "lucide-react"
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

  console.log(`[PromoBanner] Initial ads prop:`, ads)
  console.log(`[PromoBanner] Initial liveAds state:`, liveAds)

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
        console.log(`[PromoBanner] Fetching ads from /api/store/ads`)
        const res = await fetch("/api/store/ads", { cache: "no-store" })
        console.log(`[PromoBanner] Response status: ${res.status}`)
        if (!res.ok) return
        const payload = (await res.json()) as { data?: AdSlide[] }
        console.log(`[PromoBanner] Payload:`, payload)
        if (!cancelled && Array.isArray(payload.data)) {
          console.log(`[PromoBanner] Setting liveAds with ${payload.data.length} ads`)
          setLiveAds((prev) => (areAdsEqual(prev, payload.data ?? []) ? prev : (payload.data ?? [])))
        }
      } catch (error) {
        console.error(`[PromoBanner] Error fetching ads:`, error)
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
        console.log(`[PromoBanner] Interval refresh: Fetching ads from /api/store/ads`)
        const res = await fetch("/api/store/ads", { cache: "no-store" })
        console.log(`[PromoBanner] Interval refresh: Response status ${res.status}`)
        if (!res.ok) return
        const payload = (await res.json()) as { data?: AdSlide[] }
        if (Array.isArray(payload.data)) {
          console.log(`[PromoBanner] Interval refresh: Setting liveAds with ${payload.data.length} ads`)
          setLiveAds((prev) => (areAdsEqual(prev, payload.data ?? []) ? prev : (payload.data ?? [])))
        }
      } catch (error) {
        console.error(`[PromoBanner] Interval refresh error:`, error)
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="container mx-auto px-4 pt-10">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-10 items-start">
        {/* Right: Fallback advertising card */}
        {liveAds.length > 0 ? (
          <div className="shadow-xl lg:col-span-10">
            <AdCarousel ads={liveAds} />
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-950 via-slate-900 to-slate-950 shadow-xl lg:col-span-10">
            {/* Decorative glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-400/5 blur-3xl" />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 75% 25%, white 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:gap-8 lg:p-8">
              {/* Icon decoration */}
              <div className="z-10 flex shrink-0 items-center justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-orange-500/20 bg-orange-500/5 sm:h-32 sm:w-32">
                  <div className="absolute inset-2 rounded-full border border-orange-500/10" />
                  <Megaphone className="h-14 w-14 text-orange-400 sm:h-16 sm:w-16" />
                </div>
              </div>

              {/* Text + CTA */}
              <div className="z-10 flex-1">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1">
                  <Megaphone className="h-3 w-3 text-orange-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300">
                    Publicidad
                  </span>
                </div>

                <h3 className="text-lg font-black text-white sm:text-xl lg:text-2xl">
                  ¿Querés publicitar tu marca?
                </h3>
                <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Llegá a miles de técnicos instaladores y profesionales de seguridad. Espacios publicitarios en nuestra plataforma.
                </p>

                <div className="mt-4 inline-flex items-center rounded-full border border-emerald-300/20 bg-black/20 px-3 py-1">
                  <a
                    href="mailto:ventas@sommetechnology.com?subject=Publicidad"
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40 sm:text-sm"
                  >
                    Contactanos
                    <ArrowRight className="h-3.5 w-3.5" />
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

