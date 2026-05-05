import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Category } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a price string using Chilean locale (dots as thousands separator).
 * Example: 1500000 → "1.500.000"
 */
export function formatPrice(price: number): string {
  return price.toLocaleString("es-CL")
}

/**
 * Builds fallback categories from a product list when the API doesn't return categories.
 */
export function buildFallbackCategories(products: { category?: string | null }[]) {
  const names = Array.from(
    new Set(
      products
        .map((p) => p.category?.trim())
        .filter((c): c is string => Boolean(c)),
    ),
  )

  if (names.length > 0) {
    return names.map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      icon: null as string | null,
      description: null as string | null,
      active: true,
      parentId: null as string | null,
      children: [] as Category[],
    }))
  }

  return []
}
