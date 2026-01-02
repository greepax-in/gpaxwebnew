import { expect, type Page } from "@playwright/test";
import { getBodyText } from "./text.utils";
import type { IntentRules } from "./types";

export async function validateIntent(
  page: Page,
  rules: IntentRules
): Promise<void> {
  const text = await getBodyText(page);

  if (rules.manufacturer) {
    expect(text).toContain("manufacturer");
  }

  if (rules.requireIndia) {
    expect(text).toContain("india");
  }

  if (rules.bulkIntent) {
    expect(
      text.includes("bulk") ||
      text.includes("moq") ||
      text.includes("manufactur")
    ).toBeTruthy();
  }

  if (rules.forbidEcommerce) {
    [
      "add to cart",
      "checkout",
      "buy now",
      "price",
      "₹",
      "quantity",
    ].forEach(term => {
      expect(text).not.toContain(term);
    });
  }

  if (rules.requireWhatsAppCTA) {
    await expect(
      page.locator('a[href*="wa.me"], a[href*="whatsapp"]')
    ).toHaveCount(1);
  }
}
