"use client"

import { HelpCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTour } from "@/hooks/use-tour"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TourButtonProps {
  page: "home" | "catalog" | "product" | "cart"
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  label?: string
  showPulse?: boolean
}

const pulseVariants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: [0.4, 0, 0.6, 1] as const,
      repeat: Infinity,
    },
  },
}

export function TourButton({
  page,
  variant = "outline",
  size = "default",
  className,
  label = "Tour interactivo",
  showPulse = false,
}: TourButtonProps) {
  const { startTour, hasSeenTour, isNavigating, currentPage } = useTour()

  const isActive = isNavigating || (currentPage === page)

  return (
    <Button
      variant={isActive ? "default" : variant}
      size={size}
      onClick={() => startTour(page)}
      disabled={isActive}
      className={cn("gap-2 relative group", className)}
    >
      {isActive ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <motion.div
          variants={showPulse && !hasSeenTour ? pulseVariants : undefined}
          animate={showPulse && !hasSeenTour ? "pulse" : undefined}
        >
          <HelpCircle className="h-4 w-4" />
        </motion.div>
      )}
      {size !== "icon" && (isActive ? "Iniciando..." : label)}
      {!hasSeenTour && !isActive && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
      )}
    </Button>
  )
}

export function TourIconButton({
  page,
  className,
}: Omit<TourButtonProps, "variant" | "size" | "label">) {
  return (
    <TourButton
      page={page}
      variant="outline"
      size="icon"
      className={cn(
        "h-9 w-9 rounded-[1rem] border-border/70 bg-card/80 shadow-sm md:h-10 md:w-10",
        className,
      )}
      label=""
    />
  )
}
