import type { Page } from "@playwright/test";
import type { ContractEvidenceContext } from "./contractEvidence";

export interface SEORules {
  title: { min: number; max: number };
  meta: { min: number; max: number };
  singleH1?: { enabled: boolean };
  canonical?: { enabled: boolean };
}

export async function validateSEO(page: Page, rules: SEORules, ctx?: ContractEvidenceContext) {
  // ?? Read title from RAW HTTP RESPONSE (App Router + Turbopack safe)
  const response = await page.request.get("/");
  const html = await response.text();

  const titleMatch =
    html.match(/<title>([^<]+)<\/title>/i) ||
    html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i);

  const title = titleMatch?.[1]?.trim() || "";
  ctx?.emit({
    id: "SEO-01",
    pillar: "seo",
    severity: "error",
    observed: {
      title,
      length: title.length,
      source: titleMatch ? "title_or_og:title" : "none"
    },
    expected: {
      min: rules.title.min,
      max: rules.title.max
    },
    source: "dom",
    location: "head<title> or meta[property='og:title']"
  });

  // Prefer raw HTML for meta description to avoid hydration/race conditions
  const metaDescMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i
  );
  let desc = metaDescMatch?.[1]?.trim();

  // Best-effort fallback: read from DOM if not found in raw HTML (no throws)
  if (!desc) {
    try {
      const meta = page.locator('meta[name="description"]');
      const count = await meta.count();
      if (count > 0) {
        desc = (await meta.first().getAttribute("content") || "").trim();
      }
    } catch {
      // ignore (observation-only)
    }
  }

  const metaDescription = desc || "";
  ctx?.emit({
    id: "SEO-02",
    pillar: "seo",
    severity: "error",
    observed: {
      metaDescription,
      length: metaDescription.length,
      source: metaDescMatch ? "raw_html" : "dom_fallback_or_missing"
    },
    expected: {
      min: rules.meta.min,
      max: rules.meta.max
    },
    source: "dom",
    location: "meta[name='description']"
  });

  if (rules.singleH1?.enabled) {
    const h1Locator = page.locator("h1");
    const domCount = await h1Locator.count();
    ctx?.emit({
      id: "SEO-03",
      pillar: "seo",
      severity: "error",
      observed: {
        h1Count: domCount
      },
      expected: {
        count: 1
      },
      source: "dom",
      location: "h1"
    });
  }

  if (rules.canonical?.enabled) {
    const canonicalMatch = html.match(
      /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i
    );
    const canonicalHref = canonicalMatch?.[1]?.trim() || "";
    // Best-effort DOM fallback (no throws)
    let domHref = "";
    if (!canonicalHref) {
      try {
        const canonicalLocator = page.locator('link[rel="canonical"]');
        const count = await canonicalLocator.count();
        if (count > 0) domHref = (await canonicalLocator.first().getAttribute("href")) || "";
      } catch {
        // ignore (observation-only)
      }
    }

    const href = canonicalHref || domHref.trim();
    ctx?.emit({
      id: "SEO-04",
      pillar: "seo",
      severity: "error",
      observed: {
        canonicalHref: href,
        present: Boolean(href)
      },
      expected: {
        required: true
      },
      source: "dom",
      location: "link[rel='canonical']"
    });
  }
}
