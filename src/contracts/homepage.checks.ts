export const HOMEPAGE_CHECKS = {
  seo: [
    { id: "SEO-01", label: "Title length ≤ 60 characters", severity: "error" },
    { id: "SEO-02", label: "Meta description ≤ 160 characters", severity: "error" },
    { id: "SEO-03", label: "Single H1 present", severity: "error" },
    { id: "SEO-04", label: "Canonical URL defined", severity: "error" },
    { id: "SEO-05", label: "OpenGraph tags present", severity: "warn" }
  ],

  schema: [
    { id: "SCHEMA-01", label: "Organization schema present", severity: "error" },
    { id: "SCHEMA-02", label: "Organization has name and url", severity: "error" },
    { id: "SCHEMA-03", label: "WebSite schema allowed", severity: "info" },
    { id: "SCHEMA-04", label: "Product schema forbidden on homepage", severity: "error" }
  ],

  intent: [
    { id: "INTENT-01", label: "Manufacturer / bulk intent detected", severity: "error" },
    { id: "INTENT-02", label: "MOQ language allowed", severity: "warn" },
    { id: "INTENT-03", label: "No ecommerce flows present", severity: "error" }

  ],

  cta_flow: [
    { id: "CTA-01", label: "Exactly one primary WhatsApp CTA above the fold", severity: "error" },
    { id: "CTA-02", label: "Contextual WhatsApp CTAs allowed below", severity: "info" },
    { id: "CTA-03", label: "Trust-first layout respected", severity: "error" },
    {
      id: "CTA-04",
      label: "Hero image uses priority loading, fixed dimensions, and alt text (Mobile LCP guard)",
      severity: "warn"
    },
    {
      id: "CTA-05",
      label: "Mobile Largest Contentful Paint (LCP) ≤ 2500 ms",
      deprecated: true,
      aliasOf: "PERF-01",
      severity: "warn"
    },
    {
      id: "CTA-06",
      label: "Cumulative Layout Shift (CLS) ≤ 0.1",
      deprecated: true,
      aliasOf: "PERF-02",
      severity: "error"
    }
  ]
,

  /**
   * Performance budgets (Google Core Web Vitals)
   * PERF namespace is authoritative long-term
   */
  perf: [
    {
      id: "PERF-01",
      label: "Mobile Largest Contentful Paint (LCP) ≤ 2500 ms"
      ,
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
    }
    ,
    {
      id: "PERF-04",
      label: "Homepage JS bundle size within regression budget (gzip)",
      severity: "warn"
    }
  ]
};
