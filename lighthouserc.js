module.exports = {
  ci: {
    collect: {
      // App Router (app/): no hay HTML estático en .next/server/pages; se lanza
      // el servidor de producción real y se auditan URLs que existen.
      startServerCommand: "pnpm start",
      startServerUrl: "http://localhost:5001",
      url: [
        "http://localhost:5001/",
        "http://localhost:5001/catalog",
        "http://localhost:5001/categories",
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        // Para móvil local: `pnpm build && pnpm start` + `npx lhci collect --preset=desktop`
        // cambiado a preset móvil vía --settings.preset=mobile. CI usa desktop (estable).
        onlyCategories: ["performance", "accessibility", "best-practices", "seo", "pwa"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "categories:pwa": ["warn", { minScore: 0.8 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
}
