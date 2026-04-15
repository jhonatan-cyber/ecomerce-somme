import Link from "next/link"
import Image from "next/image"
import { Camera, Images, Shield } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Product } from "@/lib/types"
import { ProductCardActions } from "@/components/store/product-card-actions"

interface ProductCardProps {
  product: Product
}

function getProductImages(product: Product) {
  const values = [product.image_url, ...(product.images ?? [])]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim())
    .filter(Boolean)

  return Array.from(new Set(values))
}

export function ProductCard({ product }: ProductCardProps) {
  const productImages = getProductImages(product)
  const mainImage = productImages[0] ?? null
  const previewImages = productImages.slice(0, 3)

  return (
    <Card className="group overflow-hidden rounded-[1.35rem] border-border/70 bg-card shadow-[0_18px_50px_-35px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_60px_-35px_rgba(29,78,216,0.28)]">
      <CardContent className="p-0">
        <Link href={`/product/${encodeURIComponent(product.id)}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-[linear-gradient(180deg,#f6f9ff_0%,#edf3ff_100%)] dark:bg-[linear-gradient(180deg,rgba(30,41,59,1)_0%,rgba(15,23,42,1)_100%)]">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 38vw, 92vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Camera className="h-12 w-12 text-slate-400" />
              </div>
            )}

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
              {/* Brand Logo */}
              {product.brandLogo ? (
                <div className="h-6 w-auto overflow-hidden rounded-md border border-white/20 bg-white/90 px-1.5 py-0.5">
                  <Image
                    src={product.brandLogo}
                    alt={product.brand || "Marca"}
                    width={40}
                    height={20}
                    className="h-full w-auto object-contain"
                    unoptimized
                  />
                </div>
              ) : product.brand ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-slate-950/75 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur">
                  <Shield className="h-2.5 w-2.5" />
                  {product.brand}
                </span>
              ) : (
                <span className="max-w-[75%] truncate rounded-full border border-white/20 bg-slate-950/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                  {product.category || "Videovigilancia"}
                </span>
              )}
              {productImages.length > 1 ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-slate-950/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                  <Images className="h-3 w-3" />
                  {productImages.length}
                </span>
              ) : null}
            </div>
          </div>
        </Link>

        {previewImages.length > 1 ? (
          <div className="flex gap-2 border-t border-border/60 bg-background/70 px-3 py-2">
            {previewImages.map((image, index) => (
              <div
                key={`${product.id}-${index}`}
                className="relative h-10 w-10 overflow-hidden rounded-md border border-border/60"
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="space-y-3 px-4 py-3">
          <div className="space-y-2">
            <Link href={`/product/${encodeURIComponent(product.id)}`} className="block">
              <h3 className="line-clamp-2 text-sm font-bold leading-5 text-foreground transition group-hover:text-primary">
                {product.name}
              </h3>
            </Link>
            <p className="text-2xl font-black tracking-tight text-foreground">
              ${product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 border-t border-border/60 px-4 py-3">
        <Link
          href={`/product/${encodeURIComponent(product.id)}`}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition hover:text-primary"
        >
          Ver ficha
        </Link>

        <ProductCardActions product={product} />
      </CardFooter>
    </Card>
  )
}
