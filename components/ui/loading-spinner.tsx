import { Camera, Wifi, Video, Radio } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ 
  size = "md", 
  className
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  const containerSize = {
    sm: "h-12 w-12",
    md: "h-16 w-16", 
    lg: "h-20 w-20"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("relative", containerSize[size])}>
        {/* Outer rotating ring with gradient */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-spin",
            containerSize[size]
          )}
          style={{
            animationDuration: "4s",
            animationTimingFunction: "linear",
            backgroundSize: "200% 200%",
            backgroundPosition: "0% 50%"
          }}
        />
        
        {/* Middle rotating ring (reverse) */}
        <div 
          className={cn(
            "absolute inset-2 rounded-full border border-primary/30 border-t-primary/60 border-r-primary/40 animate-spin",
            containerSize[size]
          )}
          style={{
            animationDuration: "2.5s",
            animationTimingFunction: "ease-in-out",
            animationDirection: "reverse"
          }}
        />
        
        {/* Inner rotating ring */}
        <div 
          className={cn(
            "absolute inset-4 rounded-full border border-primary/20 border-t-primary/40 border-l-transparent animate-spin",
            containerSize[size]
          )}
          style={{
            animationDuration: "1.5s",
            animationTimingFunction: "linear"
          }}
        />
        
        {/* Center icons container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Main camera icon - rotating and scaling */}
            <Camera 
              className={cn(
                "text-primary animate-spin",
                sizeClasses[size]
              )}
              style={{
                animationDuration: "3s",
                animationTimingFunction: "ease-in-out",
                transformOrigin: "center"
              }}
            />
            
            {/* Orbiting wifi icon */}
            <div 
              className="absolute inset-0 animate-spin"
              style={{
                animationDuration: "2s",
                animationTimingFunction: "linear"
              }}
            >
              <Wifi 
                className={cn(
                  "absolute text-primary/70 animate-pulse",
                  size === "sm" ? "h-2 w-2 -top-2 -left-1" : 
                  size === "md" ? "h-3 w-3 -top-3 -left-1.5" : 
                  "h-4 w-4 -top-4 -left-2"
                )}
                style={{
                  animationDuration: "1s"
                }}
              />
            </div>
            
            {/* Orbiting video icon */}
            <div 
              className="absolute inset-0 animate-spin"
              style={{
                animationDuration: "2.5s",
                animationTimingFunction: "linear",
                animationDirection: "reverse"
              }}
            >
              <Video 
                className={cn(
                  "absolute text-primary/60 animate-pulse",
                  size === "sm" ? "h-2 w-2 -bottom-2 -right-1" : 
                  size === "md" ? "h-3 w-3 -bottom-3 -right-1.5" : 
                  "h-4 w-4 -bottom-4 -right-2"
                )}
                style={{
                  animationDuration: "1.2s",
                  animationDelay: "0.3s"
                }}
              />
            </div>
            
            {/* Orbiting radio icon */}
            <div 
              className="absolute inset-0 animate-spin"
              style={{
                animationDuration: "3s",
                animationTimingFunction: "ease-in-out"
              }}
            >
              <Radio 
                className={cn(
                  "absolute text-primary/50 animate-pulse",
                  size === "sm" ? "h-2 w-2 -left-2 top-0" : 
                  size === "md" ? "h-3 w-3 -left-3 top-0" : 
                  "h-4 w-4 -left-4 top-0"
                )}
                style={{
                  animationDuration: "0.8s",
                  animationDelay: "0.6s"
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Pulsing glow effect */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full bg-primary/10 animate-ping",
            containerSize[size]
          )}
          style={{
            animationDuration: "2s"
          }}
        />
      </div>
    </div>
  )
}

export function LoadingSpinnerCentered({ 
  size = "lg", 
  className 
}: { size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <LoadingSpinner size={size} />
    </div>
  )
}

export function PageLoadingSpinner() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-muted-foreground">Cargando contenido...</p>
      </div>
    </div>
  )
}
