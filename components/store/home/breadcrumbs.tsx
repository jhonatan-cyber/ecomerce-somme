import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuwesomme.cloud").replace(/\/$/, "")

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      ...items.map((item, index) => ({
        "@type": "ListItem" as const,
        position: index + 2,
        name: item.label,
        ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
      })),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link
          href="/"
          className="flex items-center gap-1 text-muted-foreground transition hover:text-foreground"
        >
          <Home className="h-3 w-3" />
          Inicio
        </Link>
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted-foreground transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
