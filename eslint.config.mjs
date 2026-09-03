import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    // Evita el detector de versión de eslint-plugin-react (incompatible
    // con ESLint 10): versión fijada a la instalada.
    settings: { react: { version: "19.2" } },
  },
  {
    // Tests y scripts: los mocks con `as any` y el require() CommonJS son
    // el patrón intencional; no aportan errores de runtime.
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Rollout gradual: setState-en-efecto es el patrón actual de sincronía
    // en 15 componentes (funciona, pero causa renders en cascada). Migrar
    // a init perezoso caso por caso; use-mobile ya migrado como ejemplo.
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  {
    // Artefactos generados y deps fuera del lint de código.
    ignores: ["node_modules/**", ".next/**", "coverage/**", "public/sw.js", "public/workbox-*.js"],
  },
]

export default eslintConfig
