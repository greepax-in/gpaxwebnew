
// FILE: tests/contracts/home.negative.spec.ts

import { test, expect } from "@playwright/test";

/**
 * 🔒 Homepage Negative Contract — Drift Guard (Refined)
 *
 * Allows:
 * - Indicative pricing (₹ / Rs / INR)
 *
 * Blocks:
 * - Transactional pricing intent
 * - Ecommerce CTA language
 * - CTA-level pricing
 */

const FORBIDDEN_ECOMMERCE_TERMS = [
  "add to cart",
  "cart",
  "checkout",
  "buy now",
  "payment",
  "price list",
  "discount",
  "offer ends",
  "sale",
  "cod",
];

/**
 * Pricing is allowed ONLY when informational.
 * Pricing combined with action verbs indicates ecommerce intent.
 */
const TRANSACTIONAL_PRICING_PATTERNS = [
  /buy\s+.*₹/i,
  /₹.*buy/i,
  /checkout.*₹/i,
  /pay\s+₹/i,
  /₹\s*only/i,
  /order\s+now\s+₹/i,
];

test.describe("Homepage Negative Drift Guard", () => {
  test("homepage must not introduce ecommerce language", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const bodyText = (
      await page.locator("body").innerText()
    ).toLowerCase();

    const forbiddenHits = FORBIDDEN_ECOMMERCE_TERMS.filter((term) =>
      bodyText.includes(term)
    );

    expect(
      forbiddenHits,
      `❌ Forbidden ecommerce language detected:\n${forbiddenHits.join(", ")}`
    ).toHaveLength(0);
  });

  test("homepage pricing must remain indicative, not transactional", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const bodyText = await page.locator("body").innerText();

    const transactionalHits = TRANSACTIONAL_PRICING_PATTERNS.filter(
      (pattern) => pattern.test(bodyText)
    );

    expect(
      transactionalHits,
      `❌ Transactional pricing language detected on homepage`
    ).toHaveLength(0);
  });

  test("homepage CTA labels must not contain pricing language", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const ctaTexts = await page
      .locator('a[href*="wa.me"], button')
      .allInnerTexts();

    const pricingInCTA = ctaTexts.filter((text) =>
      /(₹|rs\.?|inr)/i.test(text)
    );

    expect(
      pricingInCTA,
      `❌ Pricing must not appear inside CTA elements:\n${pricingInCTA.join(
        ", "
      )}`
    ).toHaveLength(0);
  });

  test("homepage must have exactly one primary WhatsApp CTA above the fold", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const primaryCTA = page.locator(
      'main a[href*="wa.me"]'
    ).first();

    const box = await primaryCTA.boundingBox();

    expect(
      box?.y,
      "Primary WhatsApp CTA must appear above the fold"
    ).toBeLessThan(600);
  });
});

