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
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.6 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
}
