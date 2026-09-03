import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      // Baseline anti-regresión. Vitest 4 cuenta funciones/ramas con más
      // granularidad que v3: base v4 (2026-09, 42 suites) ~27% líneas /
      // 25% funcs / 21% ramas. Base v3 era ~21/67/72 con el mismo código.
      // Objetivo: 70/70/80 tras cubrir lib/api.ts y páginas de app/.
      thresholds: {
        lines: 25,
        functions: 24,
        branches: 20,
        statements: 24,
      },
      include: [
        "lib/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "app/**/*.{ts,tsx}",
      ],
      exclude: [
        "node_modules/**",
        "test/**",
        "**/*.test.*",
        "**/*.spec.*",
        "components/ui/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // server-only usa la condicion de export `react-server` (-> empty.js)
      // que Next.js aplica en el bundle server pero vitest no: sin este alias
      // resuelve a index.js, que lanza al importarse. Apuntar al stub local
      // (test/server-only.ts) replica el comportamiento del servidor en los
      // tests y desacopla la config del layout interno del paquete.
      "server-only": path.resolve(__dirname, "test/server-only.ts"),
    },
  },
})
