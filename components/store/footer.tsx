"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { ChevronDown, Mail, MapPin, Phone, ShieldCheck, Truck } from "lucide-react"
import { buildStoreApiUrl, fetchStoreRemote } from "@/lib/store-api-root"

type SocialLinks = {
  facebook: string | null
  instagram: string | null
  tiktok: string | null
  youtube: string | null
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

// lucide-react v1 eliminó los iconos de marcas (Facebook/Instagram/Youtube).
// Locales con el mismo estilo stroke de lucide para no cambiar el diseño.
function StrokeBrandIcon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <StrokeBrandIcon className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </StrokeBrandIcon>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <StrokeBrandIcon className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </StrokeBrandIcon>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <StrokeBrandIcon className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </StrokeBrandIcon>
  )
}

export function StoreFooter() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: null,
    instagram: null,
    tiktok: null,
    youtube: null,
  })

  useEffect(() => {
    let mounted = true

    fetchStoreRemote(buildStoreApiUrl("/settings"))
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!mounted || !payload?.data) return
        setSocialLinks({
          facebook: payload.data.facebookUrl ?? null,
          instagram: payload.data.instagramUrl ?? null,
          tiktok: payload.data.tiktokUrl ?? null,
          youtube: payload.data.youtubeUrl ?? null,
        })
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  const socials = [
    { Icon: FacebookIcon, label: "Facebook", href: socialLinks.facebook },
    { Icon: InstagramIcon, label: "Instagram", href: socialLinks.instagram },
    { Icon: TikTokIcon, label: "TikTok", href: socialLinks.tiktok },
    { Icon: YoutubeIcon, label: "YouTube", href: socialLinks.youtube },
  ]

  return (
    <footer className="mt-12 border-t border-slate-900/80 bg-slate-950 text-slate-200 sm:mt-20">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.webp"
                alt="Somme Technology"
                width={44}
                height={44}
                className="h-10 w-10 rounded-xl object-contain"
                unoptimized
              />
              <div>
                <p className="text-xl font-black text-white sm:text-2xl">Somme Technology</p>
                <p className="text-xs text-slate-400 sm:text-sm">Seguridad electrónica · Cochabamba, Bolivia</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300 sm:mt-6 sm:gap-3 sm:text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
                <Truck className="h-3.5 w-3.5 text-cyan-300" /> Despacho ágil
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> Compra segura
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsContactOpen((prev) => !prev)}
              className="flex w-full items-center justify-between sm:cursor-default sm:pointer-events-none"
              aria-expanded={isContactOpen}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Contacto</h3>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 sm:hidden ${
                  isContactOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isContactOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              } sm:grid-rows-[1fr] sm:opacity-100`}
            >
              <div className="overflow-hidden">
                <div className="space-y-2.5 pt-4 text-sm text-slate-300 sm:space-y-3 sm:pt-0">
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

                <div className="mt-4 flex items-center gap-2 sm:mt-5 sm:gap-3">
                  {socials.map(({ Icon, label, href }) =>
                    href ? (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:text-white sm:h-10 sm:w-10"
                        title={label}
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ) : (
                      <span
                        key={label}
                        className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 text-slate-500 sm:h-10 sm:w-10"
                        title={`${label} no configurado`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    ),
                  )}
                </div>
              </div>
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
