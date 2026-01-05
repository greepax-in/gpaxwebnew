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
  test("Homepage — collect contract evidence (Google-first)", async ({ browser }) => {
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

    await validateINP(staticPage, {}, ctx);

    // --------------------------------------------------
    // Contract Note: Mobile LCP emission semantics
    // Auto-injected only for mobile viewport runs
    // --------------------------------------------------
    const isMobileViewport = viewport.width <= 768;

  if (isMobileViewport) {
      // NOTE:
      // Mobile LCP emission semantics are documented in the homepage contract.
      // This test intentionally does not emit contract evidence for this condition.
    }

    const seoRules = {
      title: { min: 30, max: 60 },
      meta: { min: 70, max: 160 },
      canonical: { enabled: true },
      singleH1: { enabled: true },
    };

    const intentRules = {
      manufacturer: { enabled: true },
      requireIndia: { enabled: true },
      bulkIntent: { enabled: true },
      forbidEcommerce: { enabled: true },
    };

    const flowRules = {
      heroFirst: { enabled: true },
      trustBeforeCTA: { enabled: true },
      requireHeroLCPGuard: { enabled: true },
      requireCLSBudget: { enabled: true },
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

    await validateSchema(
      flowPage,
      {
        requireOrganization: { enabled: true },
        forbidProduct: { enabled: true },
      },
      ctx
    );

    await flowPage.close();

    // Persist evidence for report generator
    const out = path.resolve("reports/homepage.contract.evidence.json");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const report = ctx.toJSON();
    fs.writeFileSync(out, JSON.stringify(report, null, 2));

    // Verdict evaluation is handled by the verdict engine.
    // This test only collects and persists evidence.
  });
});
