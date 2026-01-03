import { expect, type Page } from "@playwright/test";
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
   * One authoritative check (no fragmentation)
   */
  if (rules.manufacturer) {
    const hasManufacturerIntent =
      normalized.includes("manufacturer") ||
      normalized.includes("manufactur") ||
      normalized.includes("bulk") ||
      normalized.includes("moq");

    if (hasManufacturerIntent) {
      ctx?.pass({
        id: "INTENT-01",
        pillar: "intent",
        label: "Manufacturer / bulk intent detected",
      });
    } else {
      ctx?.fail({
        id: "INTENT-01",
        pillar: "intent",
        label: "Manufacturer / bulk intent missing",
      });
    }
  }

  /**
   * INTENT-02: MOQ language allowed (non-failing nuance)
   */
  if (rules.requireIndia) {
    if (normalized.includes("india")) {
      ctx?.pass({
        id: "INTENT-02",
        pillar: "intent",
        label: "India context present",
      });
    } else {
      ctx?.fail({
        id: "INTENT-02",
        pillar: "intent",
        label: "India context missing",
      });
    }
  }

  /**
   * INTENT-03: No ecommerce flows present
   * Hard failure if ecommerce language appears
   */
  if (rules.forbidEcommerce) {
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

    const hasEcommerce = ecommerceTerms.some(term =>
      normalized.includes(term)
    );

    if (!hasEcommerce) {
      ctx?.pass({
        id: "INTENT-03",
        pillar: "intent",
        label: "Ecommerce language absent",
      });
    } else {
      ctx?.fail({
        id: "INTENT-03",
        pillar: "intent",
        label: "Ecommerce language detected",
      });
    }
  }

  // WhatsApp CTA checks belong to CTA / Flow validator, not Intent
}

