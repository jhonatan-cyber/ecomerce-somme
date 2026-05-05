import Link from "next/link"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"

export const metadata = {
  title: "Política de Privacidad | Somme Technology",
  description: "Cómo recopilamos, usamos y protegemos tu información personal en Somme Technology.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Legal</p>
          <h1 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">Política de Privacidad</h1>
          <p className="mt-3 text-sm text-muted-foreground">Última actualización: abril 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-foreground/80">
          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">Responsable del tratamiento</h2>
            <p>
              <strong className="text-foreground">Somme Technology</strong> — Cochabamba, Bolivia.<br />
              Contacto: <a href="mailto:edgarmartinez@gmail.com" className="font-medium text-primary hover:underline">edgarmartinez@gmail.com</a> · +591 79960578
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">Información que recopilamos</h2>
            <div className="space-y-3">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="font-semibold text-foreground">Datos que nos proporcionas</p>
                <p className="mt-1 text-muted-foreground">
                  Nombre, correo electrónico, teléfono y dirección cuando realizas una consulta o pedido.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="font-semibold text-foreground">Datos de navegación</p>
                <p className="mt-1 text-muted-foreground">
                  Información técnica como dirección IP, tipo de navegador, páginas visitadas y tiempo de sesión,
                  recopilada de forma automática para mejorar el servicio.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">Finalidad del tratamiento</h2>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Gestionar consultas, cotizaciones y pedidos.</li>
              <li>Enviar información sobre productos, promociones y novedades (solo si lo autorizas).</li>
              <li>Mejorar la experiencia de navegación y el funcionamiento del sitio.</li>
              <li>Cumplir con obligaciones legales aplicables.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">Compartición de datos</h2>
            <p>
              No vendemos ni cedemos tus datos personales a terceros. Solo los compartimos con proveedores de servicios
              estrictamente necesarios para operar el sitio (hosting, análisis web), quienes están obligados a
              mantener la confidencialidad de la información.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">Conservación de datos</h2>
            <p>
              Conservamos tus datos mientras sean necesarios para la finalidad para la que fueron recopilados o
              mientras exista una relación comercial activa. Puedes solicitar su eliminación en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">Tus derechos</h2>
            <p className="mb-3">Tienes derecho a:</p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Acceder a tus datos personales.</li>
              <li>Rectificar datos inexactos o incompletos.</li>
              <li>Solicitar la eliminación de tus datos.</li>
              <li>Oponerte al tratamiento de tus datos con fines comerciales.</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, contáctanos en{" "}
              <a href="mailto:edgarmartinez@gmail.com" className="font-medium text-primary hover:underline">
                edgarmartinez@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-foreground">Seguridad</h2>
            <p>
              Implementamos medidas técnicas y organizativas para proteger tu información contra accesos no autorizados,
              pérdida o alteración. Sin embargo, ningún sistema de transmisión por internet es 100% seguro.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <Link href="/cookies" className="hover:text-foreground hover:underline">Política de Cookies</Link>
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
