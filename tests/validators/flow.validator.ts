import { expect, type Page } from "@playwright/test";
import { getBodyText } from "./text.utils";
import type { FlowRules } from "./types";

export async function validateFlow(page: Page, rules: FlowRules) {
  const text = await getBodyText(page);

  if (rules.heroFirst) {
    const hero = page.locator("h1");
    const box = await hero.boundingBox();
    expect(box?.y).toBeLessThan(600);
  }

  if (rules.trustBeforeCTA) {
    const trustIndex = Math.max(
      text.indexOf("manufactur"),
      text.indexOf("quality"),
      text.indexOf("process")
    );

    const ctaIndex = text.indexOf("whatsapp");

    expect(
      ctaIndex === -1 || trustIndex < ctaIndex,
      "CTA appears before trust signals"
    ).toBeTruthy();
  }

  if (rules.maxPrimaryCTAs === 1) {
    await expect(
      page.locator('a[href*="wa.me"], a[href*="whatsapp"]')
    ).toHaveCount(1);
  }
}
