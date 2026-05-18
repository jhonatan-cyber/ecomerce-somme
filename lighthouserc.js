module.exports = {
  ci: {
    collect: {
      staticDistDir: ".next/server/pages",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/catalog",
        "http://localhost:3000/product/",
      ],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        onlyCategories: ["performance", "accessibility", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.6 }],
        "categories:accessibility": ["warn", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
}
