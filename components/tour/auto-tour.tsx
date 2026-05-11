"use client"

import { useEffect } from "react"
import { useTour } from "@/hooks/use-tour"

interface AutoTourProps {
  page: "home" | "catalog" | "product" | "cart"
  delay?: number
}

export function AutoTour({ page, delay = 1500 }: AutoTourProps) {
  const { startTour, hasSeenTour } = useTour()

  useEffect(() => {
    if (hasSeenTour) return

    const timer = setTimeout(() => {
      startTour(page)
    }, delay)

    return () => clearTimeout(timer)
  }, [page, delay, hasSeenTour, startTour])

  return null
}
