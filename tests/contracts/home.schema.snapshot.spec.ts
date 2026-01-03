
// FILE: tests/contracts/home.schema.snapshot.spec.ts

import { test, expect } from "@playwright/test";

/**
 * 🔒 Homepage Schema Snapshot — Regression Guard
 *
 * Purpose:
 * - Ensure homepage schema remains stable over time
 * - Prevent Product / Offer schema leakage
 * - Catch accidental SEO plugin or refactor damage
 *
 * This test does NOT validate schema correctness.
 * That is handled elsewhere.
 *
 * This test ONLY detects schema drift.
 */

function normalizeSchema(schema: unknown) {
  return JSON.parse(
    JSON.stringify(schema, (_key, value) => {
      // Remove volatile identifiers
      if (_key === "@id" || _key === "url" || _key === "logo") {
        return undefined;
      }

      if (Array.isArray(value)) {
        return value
          .map((v) => v)
          .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      }
      return value;
    })
  );
}

test.describe("Homepage Schema Snapshot", () => {
  test("homepage JSON-LD schema must not regress", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const schemas = await page.$$eval(
      'script[type="application/ld+json"]',
      (nodes) =>
        nodes.map((n) => {
          try {
            return JSON.parse(n.textContent || "{}");
          } catch {
            return null;
          }
        })
    );

    const validSchemas = schemas.filter(Boolean);

    expect(
      validSchemas.length,
      "❌ No JSON-LD schema found on homepage"
    ).toBeGreaterThan(0);

    /**
     * Hard guards — homepage must never expose Product schema
     */
    const hasProductSchema = validSchemas.some((schema: any) => {
      const types = Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"]];

      return types.includes("Product");
    });

    expect(
      hasProductSchema,
      "❌ Product schema detected on homepage (FORBIDDEN)"
    ).toBe(false);

    /**
     * Snapshot the normalized schema for regression protection
     */
    const normalized = normalizeSchema(validSchemas);

    expect(normalized).toMatchSnapshot("homepage-schema.json");
  });
});

