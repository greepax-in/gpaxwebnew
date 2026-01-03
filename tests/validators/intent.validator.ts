import { expect, type Page } from "@playwright/test";
import { getBodyText } from "./text.utils";
import type { IntentRules } from "./types";
import type { ContractEvidenceContext } from "./contractEvidence"; // ✅ ADD THIS

export async function validateIntent(
  page: Page,
  rules: IntentRules,
  ctx?: ContractEvidenceContext
): Promise<void> {
  const text = await getBodyText(page);

  if (rules.manufacturer) {
      if (text.includes("manufacturer")) {
        ctx?.pass({ id: "INTENT-01", pillar: "intent", label: "Manufacturer intent detected" });
      } else {
        ctx?.fail({ id: "INTENT-01", pillar: "intent" });
      }
  }

  if (rules.requireIndia) {
      if (text.includes("india")) {
        ctx?.pass({ id: "INTENT-02", pillar: "intent", label: "India context present" });
      } else {
        ctx?.fail({ id: "INTENT-02", pillar: "intent" });
      }
  }

  if (rules.bulkIntent) {
    expect(
      text.includes("bulk") ||
      text.includes("moq") ||
      text.includes("manufactur")
    ).toBeTruthy();
    ctx?.pass({ id: "INTENT-03", pillar: "intent", label: "Bulk / MOQ intent detected" });
  }

  if (rules.forbidEcommerce) {
    [
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
    ].forEach(term => {
      expect(text).not.toContain(term);
    });
    ctx?.pass({ id: "INTENT-04", pillar: "intent", label: "Ecommerce language absent" });
  }

  if (rules.requireWhatsAppCTA) {
    const whatsappLinks = page.locator(
      'main a[href*="wa.me"], main a[href*="whatsapp"]'
    );

    await expect(
      whatsappLinks.first(),
      "❌ Homepage must have a primary WhatsApp CTA as the first WhatsApp link"
    ).toBeVisible();

    ctx?.pass({
      id: "INTENT-05",
      pillar: "intent",
      label: "Primary WhatsApp CTA present",
    });
  }
}
