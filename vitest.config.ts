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
