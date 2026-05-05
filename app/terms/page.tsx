import Link from "next/link"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"

export const metadata = {
  title: "Términos y Condiciones | Somme Technology",
  description: "Términos y condiciones de uso del sitio y servicio de Somme Technology.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Legal</p>
          <h1 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">Términos y Condiciones</h1>
          <p className="mt-3 text-sm text-muted-foreground">Última actualización: abril 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-foreground/80">
          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar el sitio web de <strong className="text-foreground">Somme Technology</strong>,
              aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte,
              te pedimos que no utilices el sitio.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">2. Uso del sitio</h2>
            <p className="mb-3">Al usar este sitio te comprometes a:</p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>No utilizar el sitio para fines ilegales o no autorizados.</li>
              <li>No intentar acceder a áreas restringidas del sistema.</li>
              <li>No reproducir, duplicar o vender contenido del sitio sin autorización expresa.</li>
              <li>Proporcionar información veraz al realizar consultas o pedidos.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">3. Productos y precios</h2>
            <p>
              Los precios mostrados en el catálogo están expresados en bolivianos (Bs.) e incluyen impuestos aplicables,
              salvo indicación contraria. Nos reservamos el derecho de modificar precios sin previo aviso.
              Los precios confirmados al momento de la cotización o pedido son los que aplican a esa transacción.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">4. Disponibilidad de stock</h2>
            <p>
              La disponibilidad de productos mostrada en el sitio es referencial y puede variar. Confirmamos
              la disponibilidad real al momento de procesar cada pedido o cotización. En caso de no disponibilidad,
              te contactaremos para ofrecerte alternativas.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">5. Despacho y entrega</h2>
            <p>
              Los envíos se coordinan a todo el país. Los plazos de entrega son estimativos y pueden variar
              según la ubicación y disponibilidad del servicio de transporte. Somme Technology no se hace
              responsable por demoras causadas por terceros transportistas.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">6. Garantía</h2>
            <p>
              Los productos cuentan con garantía del fabricante según las condiciones de cada producto.
              Para hacer válida una garantía, el producto debe presentarse con su comprobante de compra
              y sin evidencia de daño por mal uso. Contáctanos para gestionar cualquier reclamo de garantía.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">7. Propiedad intelectual</h2>
            <p>
              Todo el contenido del sitio (textos, imágenes, logotipos, diseño) es propiedad de Somme Technology
              o de sus respectivos titulares. Queda prohibida su reproducción total o parcial sin autorización escrita.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">8. Limitación de responsabilidad</h2>
            <p>
              Somme Technology no será responsable por daños indirectos, incidentales o consecuentes derivados
              del uso o imposibilidad de uso del sitio. La responsabilidad máxima se limita al valor del
              producto o servicio involucrado en la reclamación.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">9. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de actualizar estos términos en cualquier momento. Los cambios entran
              en vigor desde su publicación en el sitio. El uso continuado del sitio implica la aceptación
              de los términos vigentes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">10. Contacto</h2>
            <p>
              Para consultas sobre estos términos, contáctanos en{" "}
              <a href="mailto:edgarmartinez@gmail.com" className="font-medium text-primary hover:underline">
                edgarmartinez@gmail.com
              </a>{" "}
              o al +591 79960578.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground hover:underline">Política de Privacidad</Link>
          <span>·</span>
          <Link href="/cookies" className="hover:text-foreground hover:underline">Política de Cookies</Link>
          <span>·</span>
          <Link href="/" className="hover:text-foreground hover:underline">Volver al inicio</Link>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
