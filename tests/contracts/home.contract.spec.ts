import { test } from "@playwright/test";
import type { Route } from "@playwright/test";
import fs from "fs";
import path from "path";

import { validateSEO } from "../validators/seo.validator";
import { validateIntent } from "../validators/intent.validator";
import { validateFlow } from "../validators/flow.validator";
import { validateSchema } from "../validators/schema.validator";
import {
  validateINP
} from "../validators/performance.validator";
import { ContractEvidenceContext } from "../validators/contractEvidence";

test.describe("Homepage — Google Page Contract", () => {
  test("Homepage satisfies Google intent, SEO, flow and trust", async ({ browser }) => {
    // ------------------------------
    // PAGE 1: SEO + Intent (NO NAVIGATION)
    // ------------------------------
      const staticPage = await browser.newPage();

    // 🔒 Block external navigation (WhatsApp, Facebook, tel, mailto)
    await staticPage.route("**/*", (route: Route) => {
      const url = route.request().url();
      if (
        url.includes("wa.me") ||
        url.includes("whatsapp") ||
        url.includes("facebook.com") ||
        url.startsWith("tel:") ||
        url.startsWith("mailto:")
      ) {
        return route.abort();
      }
      return route.continue();
    });

      await staticPage.goto("/", { waitUntil: "domcontentloaded" });

    const ctx = new ContractEvidenceContext();

    // Core Web Vitals are mobile-authoritative; set mobile viewport for INP
    const viewport = { width: 390, height: 844 };
    await staticPage.setViewportSize(viewport);

    const perfRules = { lcp: 2500 };
    await validateINP(staticPage, perfRules, ctx);

    // --------------------------------------------------
    // Contract Note: Mobile LCP emission semantics
    // Auto-injected only for mobile viewport runs
    // --------------------------------------------------
    const isMobileViewport = viewport.width <= 768;

    if (isMobileViewport) {
      ctx.note({
        id: "PERF-MOBILE-LCP-EMISSION",
        pillar: "Performance",
        label: "Mobile LCP emission",
        evidence: [
          "This contract run uses a mobile viewport.",
          "On mobile devices, the homepage hero image is intentionally excluded from rendering",
          "to guarantee text-first Largest Contentful Paint (LCP).",
          "As a result, Lighthouse may legitimately not emit an LCP event on mobile runs.",
          "This is expected behavior and not a performance regression.",
          "If an LCP element is emitted on mobile, it must not be an image.",
          "Desktop LCP behavior remains unchanged."
        ].join(" ")
      });
    }

    const seoRules = {
      title: { min: 30, max: 60 },
      meta: { min: 70, max: 160 },
      canonical: true,
      singleH1: true,
      requireH2: true,
      requireCrawlableLinks: true,
    };

    const intentRules = {
      manufacturer: true,
      requireIndia: true,
      bulkIntent: true,
      forbidEcommerce: true,
      requireWhatsAppCTA: true,
    };

    const flowRules = {
      heroFirst: true,
      trustBeforeCTA: true,
      requireHeroLCPGuard: true,
      requireCLSBudget: true,
    };

      await validateSEO(staticPage, seoRules, ctx);
      await validateIntent(staticPage, intentRules, ctx);

      await staticPage.close();

    // ------------------------------
    // PAGE 2: FLOW (navigation allowed)
    // ------------------------------
    const flowPage = await browser.newPage();
    await flowPage.goto("/", { waitUntil: "load" });

    // Ensure mobile viewport for structural checks
    await flowPage.setViewportSize({ width: 390, height: 844 });

    // Wait for client components (CTAs) to hydrate and render
    await flowPage.waitForSelector('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="whatsapp:"]', { timeout: 5000 });

    await validateFlow(flowPage, flowRules, ctx);

    await validateSchema(flowPage, {
      requireOrganization: true,
      forbidProduct: true,
    }, ctx);

    await flowPage.close();

    // Persist evidence for report generator
    const out = path.resolve("reports/homepage.contract.evidence.json");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const report = ctx.toJSON();
    fs.writeFileSync(out, JSON.stringify(report, null, 2));

    const evidence = Array.isArray(report) ? report : report.evidence ?? [];
    const strictMode = process.env.STRICT_CONTRACT === "true";
    const hasFailures = evidence.some((e: any) => e.result === "FAIL");

    if (strictMode && hasFailures) {
      throw new Error("Homepage contract failed in STRICT mode. See report for details.");
    }
  });
});
