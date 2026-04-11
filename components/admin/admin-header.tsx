import { LogoutButton } from "./logout-button"
import { Store } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Store className="h-6 w-6" />
          <span>Panel Administrativo</span>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
