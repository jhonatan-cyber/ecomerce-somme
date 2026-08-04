/**
 * Lint de frontera cliente/servidor del storefront.
 *
 * Regla: ningún archivo con la directiva "use client" puede importar módulos
 * server-only de lib/ que arrastran `next/server` (NextResponse) o lógica
 * exclusiva del servidor (rate-limit en memoria) al bundle del navegador.
 * FORBIDDEN_MODULES lista los módulos protegidos; cada entrada es el path
 * relativo a lib/ (p. ej. "server/rate-limit").
 *
 * Uso: node scripts/lint-client-boundary.js  (exit 0 = limpio, 1 = violación)
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")

// Módulos server-only que ningún componente cliente puede importar.
// Entradas = path relativo a lib/ ("server/rate-limit" para lib/server/rate-limit.ts).
const FORBIDDEN_MODULES = ["server-store-proxy", "server-store-api", "server/rate-limit"]

// Directorios que pueden contener componentes con "use client".
const CLIENT_DIRS = ["components", "app", "hooks"]

// Captura imports estáticos, side-effect imports (`import "x"`), imports
// dinámicos (`import("x")`) y re-exports (`export { x } from "x"`,
// `export * from "x"`) — estos últimos también arrastran el módulo al bundle
// del cliente aunque no usen la palabra `import`.
//
// Limitación conocida: un comentario o string que contenga literalmente
// `import("@/lib/server-store-proxy")` puede dar un falso positivo; al
// revisar una violación, confirmar que es código real y no un texto.
const IMPORT_RE =
  /(?:import\s+(?:[\w$*{}, \n]+?\s+from\s+)?["']([^"']+)["'])|(?:export\s+(?:[\w$*{}, \n]+?\s+from\s+)?["']([^"']+)["'])|(?:import\(\s*["']([^"']+)["']\s*\))/g

function hasUseClient(filePath) {
  const content = fs.readFileSync(filePath, "utf8")
  // El directive debe estar en el prólogo del archivo (Next.js lo exige al
  // tope), pero puede haber comentarios encima — p. ej. un header de licencia.
  // Escanear las primeras 20 líneas en vez de un slice fijo de chars evita
  // falsos negativos con comentarios largos.
  const firstLines = content.split(/\r?\n/, 20).join("\n")
  return /["']use client["']/.test(firstLines)
}

function resolveImport(fromFile, specifier) {
  if (specifier.startsWith("@/")) {
    return path.join(ROOT, specifier.slice(2))
  }
  if (specifier.startsWith(".")) {
    return path.resolve(path.dirname(fromFile), specifier)
  }
  return null // paquete externo (react, next, lucide...): fuera de la frontera
}

function normalize(p) {
  // Compara sin extensión: "@/lib/server-store-proxy" y
  // "@/lib/server-store-proxy.ts" apuntan al mismo módulo.
  return p.replace(/\.(ts|tsx|js|jsx)$/, "")
}

function collectFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue
      collectFiles(full, out)
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

let violations = 0

for (const dir of CLIENT_DIRS) {
  const absDir = path.join(ROOT, dir)
  if (!fs.existsSync(absDir)) continue

  for (const file of collectFiles(absDir)) {
    if (!hasUseClient(file)) continue

    const content = fs.readFileSync(file, "utf8")
    let match
    IMPORT_RE.lastIndex = 0

    while ((match = IMPORT_RE.exec(content)) !== null) {
      const specifier = match[1] || match[2] || match[3]
      if (!specifier) continue

      const resolved = resolveImport(file, specifier)
      if (!resolved) continue

      const normalized = normalize(resolved)
      for (const mod of FORBIDDEN_MODULES) {
        const target = normalize(path.join(ROOT, "lib", mod))
        if (normalized === target) {
          console.error(
            `[lint-client-boundary] ${path.relative(ROOT, file)} importa "${specifier}" ` +
              `(módulo server-only lib/${mod}) desde un archivo con "use client".`,
          )
          violations++
        }
      }
    }
  }
}

if (violations > 0) {
  console.error(
    `[lint-client-boundary] ${violations} violación(es) de la frontera cliente/servidor.`,
  )
  process.exit(1)
}

console.log(
  "[lint-client-boundary] OK: ningún componente \"use client\" importa módulos server-only.",
)
