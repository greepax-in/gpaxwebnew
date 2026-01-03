import { expect, type Page } from "@playwright/test";
import type { ContractEvidenceContext } from "./contractEvidence";

export interface SEORules {
  title: { min: number; max: number };
  meta: { min: number; max: number };
  singleH1?: boolean;
  canonical?: boolean;
  requireCrawlableLinks?: boolean;
  requireH2?: boolean;
}

export async function validateSEO(page: Page, rules: SEORules, ctx?: ContractEvidenceContext) {
  const title = await page.title();
  expect(title.length).toBeGreaterThanOrEqual(rules.title.min);
  expect(title.length).toBeLessThanOrEqual(rules.title.max);
  ctx?.pass({ id: "SEO-01", pillar: "seo", label: "Title length within bounds" });

  const meta = page.locator('meta[name="description"]');
  await expect(meta).toHaveCount(1);

  const desc = await meta.getAttribute("content");
  expect(desc, "Meta description content missing").toBeTruthy();
  expect(desc!.length).toBeGreaterThanOrEqual(rules.meta.min);
  expect(desc!.length).toBeLessThanOrEqual(rules.meta.max);
  ctx?.pass({ id: "SEO-02", pillar: "seo", label: "Meta description within bounds" });

  if (rules.singleH1) {
    await expect(page.locator("h1")).toHaveCount(1);
    ctx?.pass({ id: "SEO-03", pillar: "seo", label: "Single H1 present" });
  }

  if (rules.canonical) {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    ctx?.pass({ id: "SEO-04", pillar: "seo", label: "Canonical URL defined" });
  }

  /**
   * SEO-06: Homepage must expose crawlable links
   * Googlebot must be able to discover category pages
   * WhatsApp-only CTAs are ignored
   */
  if (rules.requireCrawlableLinks) {
    const internalLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
        .map(a => a.getAttribute("href") || "")
        .filter(href =>
          href.startsWith("/") &&
          !href.startsWith("//") &&
          !href.includes("wa.me") &&
          !href.includes("whatsapp") &&
          !href.includes("tel:")
        );
    });

    if (internalLinks.length > 0) {
      ctx?.pass({ id: "SEO-07", pillar: "seo" });
    } else {
      ctx?.fail({ id: "SEO-07", pillar: "seo" });
    }
  }

  if (rules.requireH2) {
    const h2Count = await page.locator("h2").count();
    expect(
      h2Count,
      "Expected at least one H2 on the page"
    ).toBeGreaterThan(0);
    ctx?.pass({ id: "SEO-06", pillar: "seo", label: "At least one H2 present" });
  }
}
