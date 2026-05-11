"use client"

import Image from "next/image"
import Link from "next/link"

interface Brand {
  id: string
  name: string
  logo: string | null
}

interface BrandsCarouselProps {
  brands: Brand[]
  products?: { brandId?: string | null }[]
}

export function BrandsCarousel({ brands, products = [] }: BrandsCarouselProps) {
  const brandsWithLogos = brands.filter((b) => b.logo)

  if (brandsWithLogos.length === 0) return null

  // Count products per brand
  const brandCounts = new Map<string, number>()
  products.forEach((p) => {
    if (p.brandId) {
      brandCounts.set(p.brandId, (brandCounts.get(p.brandId) ?? 0) + 1)
    }
  })

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brandsWithLogos, ...brandsWithLogos]

  return (
    <section data-tour="brands-carousel" className="container mx-auto px-4 pt-8">
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Marcas disponibles
      </p>

      {/* Marquee container */}
      <div className="relative overflow-hidden">
        {/* Gradient fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

        {/* Scrolling track */}
        <div className="flex animate-marquee gap-8 py-2">
          {duplicatedBrands.map((brand, index) => {
            const count = brandCounts.get(brand.id) ?? 0
            return (
              <Link
                key={`${brand.id}-${index}`}
                href={`/catalog?brand=${brand.id}`}
                className="group relative flex h-26 w-56 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-card transition hover:border-primary/40 hover:bg-muted/50"
              >
                <Image
                  src={brand.logo!}
                  alt={brand.name}
                  fill
                  className="object-cover transition group-hover:opacity-100"
                  unoptimized
                />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
