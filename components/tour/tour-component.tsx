"use client"

import { useEffect, useRef, useCallback, createElement, useState } from "react"
import { driver, type DriveStep } from "driver.js"
import "driver.js/dist/driver.css"
import confetti from "canvas-confetti"
import { useTour } from "@/hooks/use-tour"
import { getStepsForPage } from "@/lib/tour-steps"

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  return prefersReducedMotion
}

function TourCard({
  step,
  current,
  total,
  onNext,
  onPrev,
  onClose,
}: {
  step: DriveStep
  current: number
  total: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
}) {
  const popover = step.popover
  const title = typeof popover?.title === "string" ? popover.title : ""
  const description = typeof popover?.description === "string" ? popover.description : ""
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0

  return createElement("div", {
    className:
      "w-[300px] max-w-[calc(100vw-2rem)] rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden sm:w-[320px]",
    style: { fontFamily: "inherit" },
    children: [
      // Progress bar
      createElement("div", {
        key: "progress-track",
        className: "h-0.5 w-full bg-muted",
        children: createElement("div", {
          className: "h-full bg-primary transition-all duration-300 ease-out",
          style: { width: `${progress}%` },
        }),
      }),
      // Header
      createElement("div", {
        key: "header",
        className: "flex items-start justify-between gap-3 px-4 pt-4 pb-3 sm:px-5 sm:pt-5",
        children: [
          createElement("div", {
            className: "flex flex-col gap-1 min-w-0 flex-1",
            children: [
              createElement("span", {
                key: "step-label",
                className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
                children: `Paso ${current + 1} de ${total}`,
              }),
              createElement("h3", {
                key: "title",
                className: "text-sm font-semibold leading-none tracking-tight sm:text-base",
                children: title,
              }),
            ],
          }),
          createElement("button", {
            key: "close",
            type: "button",
            onClick: onClose,
            className:
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 transition hover:bg-accent hover:text-foreground",
            children: "✕",
          }),
        ],
      }),
      // Description
      createElement("div", {
        key: "content",
        className: "px-4 pb-4 sm:px-5 sm:pb-5",
        children: createElement("p", {
          className: "text-xs leading-relaxed text-muted-foreground sm:text-sm",
          children: description,
        }),
      }),
      // Footer
      createElement("div", {
        key: "footer",
        className: "flex items-center justify-between gap-2 border-t px-4 py-3 sm:px-5",
        children: [
          createElement("button", {
            key: "prev",
            type: "button",
            onClick: onPrev,
            className:
              current === 0
                ? "invisible"
                : "inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground",
            children: "← Atrás",
          }),
          createElement("button", {
            key: "next",
            type: "button",
            onClick: onNext,
            className:
              "inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition hover:bg-primary/90",
            children: current === total - 1 ? "Finalizar" : "Siguiente →",
          }),
        ],
      }),
    ],
  })
}

export function TourComponent() {
  const { isOpen, currentPage, closeTour, markTourAsSeen } = useTour()
  const driverRef = useRef<ReturnType<typeof driver> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const triggerConfetti = useCallback(() => {
    if (prefersReducedMotion) return

    const colors = ["hsl(220, 90%, 56%)", "hsl(220, 90%, 70%)", "hsl(220, 100%, 85%)", "#ffffff", "hsl(160, 80%, 50%)"]
    confetti({
      particleCount: 150,
      spread: 100,
      startVelocity: 40,
      colors,
      gravity: 0.8,
      decay: 0.9,
      shapes: ["square", "circle"],
    })
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 80,
        startVelocity: 30,
        colors,
        origin: { x: 0, y: 0.7 },
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 80,
        startVelocity: 30,
        colors,
        origin: { x: 1, y: 0.7 },
      })
    }, 300)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!isOpen || !currentPage) return

    const steps = getStepsForPage(currentPage)
    if (steps.length === 0) return

    if (driverRef.current) {
      driverRef.current.destroy()
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth < 640

    driverRef.current = driver({
      showProgress: false,
      animate: !prefersReducedMotion,
      allowClose: true,
      stagePadding: isMobile ? 6 : 10,
      smoothScroll: !prefersReducedMotion,
      steps: steps.map((step) => ({
        ...step,
        popover: {
          ...step.popover,
          render: (stepData: DriveStep, opts: { current: number; total: number; onNext: () => void; onPrev: () => void; onClose: () => void }) => {
            return createElement(TourCard, {
              step: stepData,
              current: opts.current,
              total: opts.total,
              onNext: opts.onNext,
              onPrev: opts.onPrev,
              onClose: opts.onClose,
            })
          },
        },
      })),
      onHighlighted: (el) => {
        if (el) {
          const element = el as HTMLElement
          if (!prefersReducedMotion) {
            element.style.transition = "box-shadow 0.3s ease"
          }
          element.style.boxShadow = "0 0 0 2px hsl(var(--primary)), 0 0 16px hsl(var(--primary) / 0.2)"
          element.style.borderRadius = "var(--radius, 8px)"
        }
      },
      onDeselected: (el) => {
        if (el) {
          const element = el as HTMLElement
          element.style.boxShadow = ""
          element.style.borderRadius = ""
        }
      },
      onDestroyStarted: () => {
        driverRef.current?.destroy()
        closeTour()
      },
      onDestroyed: () => {
        markTourAsSeen()
        triggerConfetti()
        closeTour()
      },
    })

    const timer = setTimeout(() => {
      driverRef.current?.drive()
    }, 200)

    return () => {
      clearTimeout(timer)
      if (driverRef.current) {
        driverRef.current.destroy()
        driverRef.current = null
      }
    }
  }, [isOpen, currentPage, closeTour, markTourAsSeen, triggerConfetti, prefersReducedMotion])

  return null
}
