import { expect, type Page } from "@playwright/test";

export interface SEORules {
  title: { min: number; max: number };
  meta: { min: number; max: number };
  singleH1?: boolean;
  canonical?: boolean;
  requireH2?: boolean;
}

export async function validateSEO(page: Page, rules: SEORules) {
  const title = await page.title();
  expect(title.length).toBeGreaterThanOrEqual(rules.title.min);
  expect(title.length).toBeLessThanOrEqual(rules.title.max);

  const meta = page.locator('meta[name="description"]');
  await expect(meta).toHaveCount(1);

  const desc = await meta.getAttribute("content");
  expect(desc!.length).toBeGreaterThanOrEqual(rules.meta.min);
  expect(desc!.length).toBeLessThanOrEqual(rules.meta.max);

  if (rules.singleH1) {
    await expect(page.locator("h1")).toHaveCount(1);
  }

  if (rules.canonical) {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  }

  if (rules.requireH2) {
    const h2Count = await page.locator("h2").count();
    expect(
      h2Count,
      "Expected at least one H2 on the page"
    ).toBeGreaterThan(0);
  }
}
