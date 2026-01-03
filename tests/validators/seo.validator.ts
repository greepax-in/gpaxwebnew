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
  // 🔒 Read title from RAW HTTP RESPONSE (App Router + Turbopack safe)
  const response = await page.request.get("/");
  const html = await response.text();

  const titleMatch =
    html.match(/<title>([^<]+)<\/title>/i) ||
    html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i);

  const title = titleMatch?.[1]?.trim() || "";

  expect(
    title.length,
    "Missing title signal in HTML (<title> or og:title)"
  ).toBeGreaterThan(0);
  expect(title.length).toBeGreaterThanOrEqual(rules.title.min);
  expect(title.length).toBeLessThanOrEqual(rules.title.max);
  ctx?.pass({ id: "SEO-01", pillar: "seo", label: "Title length within bounds" });

  // Prefer raw HTML for meta description to avoid hydration/race conditions
  const metaDescMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i
  );
  let desc = metaDescMatch?.[1]?.trim();

  if (!desc) {
    // Fallback to DOM locator if raw HTML missing (e.g., dev preview)
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveCount(1);
    desc = (await meta.getAttribute("content") || "").trim();
  }

  expect(desc, "Meta description content missing").toBeTruthy();
  expect(desc!.length).toBeGreaterThanOrEqual(rules.meta.min);
  expect(desc!.length).toBeLessThanOrEqual(rules.meta.max);
  ctx?.pass({ id: "SEO-02", pillar: "seo", label: "Meta description within bounds" });

  if (rules.singleH1) {
    // 🔒 Ensure App Router body has mounted before semantic checks
    // This is a semantic readiness gate, NOT a timing wait
    await page.locator("body").waitFor();

    const h1Locator = page.locator("h1");

    // 🔒 SEO-03: Semantic H1 existence (visibility not required)
    const domCount = await h1Locator.count();

    // 🔎 FINAL DIAGNOSTIC (TEMPORARY)
    if (domCount === 0) {
      const url = page.url();
      const html = await page.content();
      console.log("SEO DEBUG URL:", url);
      console.log("SEO DEBUG HTML (first 800 chars):");
      console.log(html.slice(0, 800));
    }

    expect(
      domCount > 0,
      "Expected at least one H1 on the page"
    ).toBeTruthy();

    expect(domCount, "Expected exactly one H1 on the page").toBe(1);

    ctx?.pass({ id: "SEO-03", pillar: "seo", label: "Single H1 present" });
  }

  if (rules.canonical) {
    const canonicalMatch = html.match(
      /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i
    );
    const canonicalHref = canonicalMatch?.[1]?.trim() || "";

    if (canonicalHref) {
      ctx?.pass({ id: "SEO-04", pillar: "seo", label: "Canonical URL defined" });
    } else {
      const canonicalLocator = page.locator('link[rel="canonical"]');
      await expect(canonicalLocator).toHaveCount(1);
      const href = (await canonicalLocator.first().getAttribute("href")) || "";
      expect(href.trim(), "Canonical href must not be empty").toBeTruthy();
      ctx?.pass({ id: "SEO-04", pillar: "seo", label: "Canonical URL defined" });
    }
  }

  /**
   * SEO-07: Homepage must expose crawlable links
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
      ctx?.pass({
        id: "SEO-07",
        pillar: "seo",
        label: "Crawlable internal links present",
      });
    } else {
      ctx?.fail({
        id: "SEO-07",
        pillar: "seo",
        label: "No crawlable internal links found",
      });
    }
  }

  /**
   * SEO-08: At least one H2 present
   */
  if (rules.requireH2) {
    const h2Count = await page.locator("h2").count();
    expect(
      h2Count,
      "Expected at least one H2 on the page"
    ).toBeGreaterThan(0);
    ctx?.pass({
      id: "SEO-08",
      pillar: "seo",
      label: "At least one H2 present",
    });
  }

  /**
   * SEO-06: Homepage must be indexable
   * Guards against accidental noindex / noarchive
   */
  const robotsMeta = page.locator('meta[name="robots"]');
  if (await robotsMeta.count()) {
    const content = (await robotsMeta.first().getAttribute("content")) || "";
    expect(
      content.toLowerCase(),
      "Homepage must not contain noindex or noarchive"
    ).not.toMatch(/noindex|noarchive/);
  }
  ctx?.pass({
    id: "SEO-06",
    pillar: "seo",
    label: "Homepage is indexable",
  });
}
