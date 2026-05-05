import Link from "next/link"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"

export const metadata = {
  title: "Política de Cookies | Somme Technology",
  description: "Información sobre el uso de cookies en Somme Technology.",
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Legal</p>
          <h1 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">Política de Cookies</h1>
          <p className="mt-3 text-sm text-muted-foreground">Última actualización: abril 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-foreground/80">
          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas.
              Sirven para recordar tus preferencias, mejorar tu experiencia de navegación y analizar el uso del sitio.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">¿Qué cookies utilizamos?</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="font-semibold text-foreground">Cookies esenciales</p>
                <p className="mt-1 text-muted-foreground">
                  Necesarias para el funcionamiento básico del sitio, como mantener el carrito de compras activo durante tu sesión.
                  No pueden desactivarse.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="font-semibold text-foreground">Cookies de preferencias</p>
                <p className="mt-1 text-muted-foreground">
                  Recuerdan tus configuraciones como el tema (claro/oscuro) y otras preferencias de visualización.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="font-semibold text-foreground">Cookies analíticas</p>
                <p className="mt-1 text-muted-foreground">
                  Nos ayudan a entender cómo los visitantes interactúan con el sitio para mejorar su funcionamiento.
                  Los datos son anónimos y agregados.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">¿Cómo controlar las cookies?</h2>
            <p>
              Puedes configurar tu navegador para rechazar o eliminar cookies en cualquier momento. Ten en cuenta que
              deshabilitar ciertas cookies puede afectar la funcionalidad del sitio. Consulta la ayuda de tu navegador
              para más información.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">Cookies de terceros</h2>
            <p>
              Algunos servicios integrados en nuestro sitio (como herramientas de análisis) pueden establecer sus propias
              cookies. No tenemos control directo sobre estas cookies y te recomendamos revisar las políticas de privacidad
              de dichos servicios.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">Contacto</h2>
            <p>
              Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos en{" "}
              <a href="mailto:edgarmartinez@gmail.com" className="font-medium text-primary hover:underline">
                edgarmartinez@gmail.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground hover:underline">Política de Privacidad</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-foreground hover:underline">Términos y Condiciones</Link>
          <span>·</span>
          <Link href="/" className="hover:text-foreground hover:underline">Volver al inicio</Link>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
