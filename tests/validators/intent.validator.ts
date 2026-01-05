import type { Page } from "@playwright/test";
import { getBodyText } from "./text.utils";
import type { IntentRules } from "./types";
import type { ContractEvidenceContext } from "./contractEvidence";

export async function validateIntent(
  page: Page,
  rules: IntentRules,
  ctx?: ContractEvidenceContext
): Promise<void> {
  const text = await getBodyText(page);
  const normalized = text.toLowerCase();

  /**
   * INTENT-01: Manufacturer / bulk intent detected
   * Observation only
   */
  if (rules.manufacturer?.enabled) {
    const hasManufacturerIntent =
      normalized.includes("manufacturer") ||
      normalized.includes("manufactur") ||
      normalized.includes("bulk") ||
      normalized.includes("moq");

    ctx?.emit({
      id: "INTENT-01",
      pillar: "intent",
      severity: "error",
      observed: {
        hasManufacturerIntent,
        matchedKeywords: ["manufacturer", "manufactur", "bulk", "moq"].filter(k =>
          normalized.includes(k)
        )
      },
      expected: {
        keywords: ["manufacturer", "bulk", "moq"]
      },
      source: "dom",
      location: "body text"
    });
  }

  /**
   * INTENT-02: India geographic context
   */
  if (rules.requireIndia?.enabled) {
    const hasIndiaContext = normalized.includes("india") || normalized.includes("indian");

    ctx?.emit({
      id: "INTENT-02",
      pillar: "intent",
      severity: "error",
      observed: {
        hasIndiaContext
      },
      expected: {
        keywords: ["india", "indian"]
      },
      source: "dom",
      location: "body text"
    });
  }

  /**
   * INTENT-03: No ecommerce language present
   */
  if (rules.forbidEcommerce?.enabled) {
    const ecommerceTerms = [
      "add to cart",
      "checkout",
      "buy now",
      "order online",
      "place order",
      "discount",
      "offer price",
      "sale price",
      "limited offer",
      "per unit",
      "each @",
      "₹/",
    ];

    const foundTerms = ecommerceTerms.filter(term =>
      normalized.includes(term)
    );

    ctx?.emit({
      id: "INTENT-03",
      pillar: "intent",
      severity: "error",
      observed: {
        hasEcommerceLanguage: foundTerms.length > 0,
        matchedTerms: foundTerms
      },
      expected: {
        forbidden_terms: ecommerceTerms
      },
      source: "dom",
      location: "body text"
    });
  }

  // WhatsApp CTA checks belong to Flow validator, not Intent
}
