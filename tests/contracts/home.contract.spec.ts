import { test } from "@playwright/test";
import { validateSEO } from "../validators/seo.validator";
import { validateIntent } from "../validators/intent.validator";
import { validateFlow } from "../validators/flow.validator";
import { validateSchema } from "../validators/schema.validator";

test.describe("Homepage — Google Page Contract", () => {
  test("Homepage satisfies Google intent, SEO, flow and trust", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await validateIntent(page, {
      manufacturer: true,
      requireIndia: true,
      bulkIntent: true,
      forbidEcommerce: true,
      requireWhatsAppCTA: true,
    });

    await validateSEO(page, {
      title: { min: 30, max: 60 },
      meta: { min: 70, max: 160 },
      canonical: true,
      singleH1: true,
      requireH2: true,
    });

    await validateFlow(page, {
      heroFirst: true,
      trustBeforeCTA: true,
      maxPrimaryCTAs: 1,
    });

    await validateSchema(page, {
      requireOrganization: true,
      forbidProduct: true,
    });
  });
});
