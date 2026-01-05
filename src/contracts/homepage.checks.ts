/**
 * Severity policy (GLOBAL)
 *
 * error → blocks production / violates contract
 * warn  → acceptable but degrades SEO, UX, or conversion outcomes
 * info  → evidence-only, non-evaluative
 */

export const HOMEPAGE_CHECKS = {
  seo: [
    {
      id: "SEO-01",
      label: "Title length ≤ 60 characters",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["google"]
    },
    {
      id: "SEO-02",
      label: "Meta description ≤ 160 characters",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["google"]
    },
    {
      id: "SEO-03",
      label: "Single H1 present",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["google", "user"]
    },
    {
      id: "SEO-04",
      label: "Canonical URL defined",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["google"]
    },
    {
      id: "SEO-05",
      label: "OpenGraph tags present",
      severity: "warn",
      appliesTo: ["homepage"],
      audience: ["google", "social"]
    }
  ],

  schema: [
    {
      id: "SCHEMA-01",
      label: "Organization schema present",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["google"]
    },
    {
      id: "SCHEMA-02",
      label: "Organization schema has name and url",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["google"]
    },
    {
      id: "SCHEMA-03",
      label: "WebSite schema allowed on homepage",
      severity: "info",
      appliesTo: ["homepage"],
      audience: ["google"]
    },
    {
      id: "SCHEMA-04",
      label: "Product schema forbidden on homepage",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["google"]
    }
  ],

  intent: [
    {
      id: "INTENT-01",
      label: "Manufacturer / bulk business intent detected",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["google", "user", "sales"]
    },
    {
      id: "INTENT-02",
      label: "India geographic context present",
      severity: "warn",
      appliesTo: ["homepage"],
      audience: ["google", "user"]
    },
    {
      id: "INTENT-03",
      label: "No ecommerce purchase flows present",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["user", "sales"]
    }

  ],

  cta_flow: [
    {
      id: "CTA-01",
      label: "Exactly one primary WhatsApp CTA above the fold",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["user", "sales"]
    },
    {
      id: "CTA-02",
      label: "Contextual WhatsApp CTAs allowed below the fold",
      severity: "info",
      appliesTo: ["homepage"],
      audience: ["user", "sales"]
    },
    {
      id: "CTA-03",
      label: "Trust-first layout respected (no aggressive CTA before trust signals)",
      severity: "error",
      appliesTo: ["homepage"],
      audience: ["user"]
    }
  ],

  /**
   * Performance budgets (Google Core Web Vitals)
   * PERF namespace is authoritative
   */
  perf: [
    {
      id: "PERF-00",
      label: "MUI Emotion SSR styles present at first paint",
      severity: "info",
      deprecated: true
    },
    {
      id: "PERF-01",
      label: "Mobile Largest Contentful Paint (LCP) ≤ 2500 ms",
      severity: "warn"
    },
    {
      id: "PERF-02",
      label: "Cumulative Layout Shift (CLS) ≤ 0.1",
      severity: "error"
    },
    {
      id: "PERF-03",
      label: "Interaction to Next Paint (INP) ≤ 200 ms",
      severity: "info"
    },
    {
      id: "PERF-04",
      label: "Homepage JS bundle size within regression budget (gzip)",
      severity: "warn"
    },
    {
      id: "PERF-05",
      label: "Hero image optimized for LCP (priority, fixed dimensions, modern format)",
      severity: "warn",
      appliesTo: ["homepage"],
      audience: ["google", "user"]
    }
  ]
};
