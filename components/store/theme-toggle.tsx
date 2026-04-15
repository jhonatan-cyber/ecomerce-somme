"use client"

import { useEffect, useState } from "react"
import { Laptop2, Moon, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themeOptions = [
  {
    value: "light",
    label: "Claro",
    icon: SunMedium,
  },
  {
    value: "dark",
    label: "Oscuro",
    icon: Moon,
  },
  {
    value: "system",
    label: "Sistema",
    icon: Laptop2,
  },
] as const

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = mounted ? theme ?? "system" : "system"
  const ActiveIcon =
    mounted && resolvedTheme === "dark" ? Moon : SunMedium

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-[1rem] border-border/70 bg-card/80 shadow-sm md:h-10 md:w-10"
          aria-label="Cambiar tema"
        >
          <ActiveIcon className="h-4.5 w-4.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-2xl p-2">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeTheme}
          onValueChange={(value) => setTheme(value)}
        >
          {themeOptions.map((option) => {
            const Icon = option.icon

            return (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="rounded-xl"
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="rounded-xl text-muted-foreground"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? (
            <>
              <SunMedium className="h-4 w-4" />
              Usar claro ahora
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Usar oscuro ahora
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
