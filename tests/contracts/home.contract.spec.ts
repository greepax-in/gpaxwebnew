import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

import { validateSEO } from "../validators/seo.validator";
import { validateIntent } from "../validators/intent.validator";
import { validateFlow } from "../validators/flow.validator";
import { validateSchema } from "../validators/schema.validator";
import {
  validateMUIFOUC,
  validateINP
} from "../validators/performance.validator";
import { ContractEvidenceContext } from "../validators/contractEvidence";

test.describe("Homepage — Google Page Contract", () => {
  test("Homepage satisfies Google intent, SEO, flow and trust", async ({ page }) => {
    const ctx = new ContractEvidenceContext();

    // Use full load for accurate LCP/CLS/INP capture
    await page.goto("/", { waitUntil: "load" });

    await validateMUIFOUC(page, ctx);
    await validateINP(page, ctx);

    await validateIntent(page, {
      manufacturer: true,
      requireIndia: true,
      bulkIntent: true,
      forbidEcommerce: true,
      requireWhatsAppCTA: true,
    }, ctx);

    await validateSEO(page, {
      title: { min: 30, max: 60 },
      meta: { min: 70, max: 160 },
      canonical: true,
      singleH1: true,
      requireH2: true,
       requireCrawlableLinks: true,
    }, ctx);

    await validateFlow(page, {
      heroFirst: true,
      trustBeforeCTA: true,
      // LCP timing MUST NOT be enforced in Playwright.
      // Lighthouse Mobile is the single source of truth for PERF-01 (LCP).
      // Playwright may only validate STRUCTURAL LCP guards (hero presence/order),
      // not timing budgets.
      requireHeroLCPGuard: true,
      maxPrimaryCTAs: 1,
      requireCLSBudget: true, // CTA-06: CLS ≤ 0.1
    }, ctx);

    await validateSchema(page, {
      requireOrganization: true,
      forbidProduct: true,
    }, ctx);
    ctx?.pass({
      id: "SCHEMA-01",
      pillar: "schema",
      label: "Organization schema present"
    });

    // Persist evidence for report generator
    const out = path.resolve("reports/homepage.contract.evidence.json");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(ctx.toJSON(), null, 2));

    const evidence = ctx.toJSON();
    const strictMode = process.env.STRICT_CONTRACT === "true";
    const hasFailures = evidence.some(e => e.result === "FAIL");

    if (strictMode && hasFailures) {
      throw new Error("Homepage contract failed in STRICT mode. See report for details.");
    }
  });
});
