"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { usePathname, useRouter } from "next/navigation"

type TourPage = "home" | "catalog" | "product" | "cart" | null

const pageRoutes: Record<Exclude<TourPage, null>, string> = {
  home: "/",
  catalog: "/catalog",
  product: "/product",
  cart: "/cart",
}

interface TourContextType {
  isOpen: boolean
  currentPage: TourPage
  hasSeenTour: boolean
  isNavigating: boolean
  startTour: (page: TourPage) => void
  closeTour: () => void
  resetTour: () => void
  markTourAsSeen: () => void
}

const STORAGE_KEY = "somme-tour-seen"

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<TourPage>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [pendingTour, setPendingTour] = useState<TourPage>(null)
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    if (typeof window === "undefined") return false
    try {
      return localStorage.getItem(STORAGE_KEY) === "true"
    } catch {
      return false
    }
  })

  const router = useRouter()
  const pathname = usePathname()

  const startTour = useCallback((page: TourPage) => {
    if (!page) return

    const targetRoute = pageRoutes[page]
    const currentRoute = pathname

    if (currentRoute === targetRoute || (page === "product" && currentRoute.startsWith("/product/"))) {
      setCurrentPage(page)
      setIsOpen(true)
      return
    }

    setIsNavigating(true)
    setPendingTour(page)
    router.push(targetRoute)
  }, [pathname, router])

  const closeTour = useCallback(() => {
    setIsOpen(false)
    setCurrentPage(null)
    setIsNavigating(false)
    setPendingTour(null)
  }, [])

  const resetTour = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
    setHasSeenTour(false)
  }, [])

  const markTourAsSeen = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true")
    }
    setHasSeenTour(true)
  }, [])

  useEffect(() => {
    if (isNavigating && pendingTour) {
      const targetRoute = pageRoutes[pendingTour]
      const isOnTargetPage = pathname === targetRoute || (pendingTour === "product" && pathname.startsWith("/product/"))

      if (isOnTargetPage) {
        const timer = setTimeout(() => {
          setCurrentPage(pendingTour)
          setIsOpen(true)
          setIsNavigating(false)
          setPendingTour(null)
        }, 300)

        return () => clearTimeout(timer)
      }
    }
  }, [isNavigating, pendingTour, pathname])

  return (
    <TourContext.Provider
      value={{
        isOpen,
        currentPage,
        hasSeenTour,
        isNavigating,
        startTour,
        closeTour,
        resetTour,
        markTourAsSeen,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}
