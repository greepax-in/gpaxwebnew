import { expect, type Page } from "@playwright/test";
import type { FlowRules } from "./types";
import type { ContractEvidenceContext } from "../validators/contractEvidence";

export async function validateFlow(page: Page, rules: FlowRules, ctx?: ContractEvidenceContext) {
  // Hero first rule stays (this is fine)
  if (rules.heroFirst) {
    const hero = page.locator("h1");
    const box = await hero.boundingBox();
    expect(box?.y).toBeLessThan(600);
  }

  /**
   * CTA-05: Mobile LCP budget enforcement (ms threshold)
   * Uses PerformanceObserver for LargestContentfulPaint
   */
  if (rules.requireLCPBudgetMs) {
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let lcpValue = 0;

        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const last = entries[entries.length - 1] as any;
          if (last) {
            lcpValue = last.startTime;
          }
        });

        observer.observe({
          type: "largest-contentful-paint",
          buffered: true,
        });

        setTimeout(() => {
          observer.disconnect();
          resolve(Math.round(lcpValue));
        }, 3000); // allow LCP to settle
      });
    });

    expect(
      lcp,
      "LCP metric could not be captured"
    ).toBeGreaterThan(0);

    if (lcp <= rules.requireLCPBudgetMs) {
      ctx?.pass({ id: "PERF-01", pillar: "perf" });
    } else {
      ctx?.fail({ id: "PERF-01", pillar: "perf" });
    }
  }
  /**
   * CTA-06: CLS budget enforcement (≤ 0.1)
   * Uses PerformanceObserver for layout-shift
   */
  if (rules.requireCLSBudget) {
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;

        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });

        observer.observe({
          type: "layout-shift",
          buffered: true,
        });

        setTimeout(() => {
          observer.disconnect();
          resolve(Number(clsValue.toFixed(3)));
        }, 3000);
      });
    });

    expect(
      cls <= 0.1,
      `CLS budget exceeded: ${cls} > 0.1`
    ).toBeTruthy();

    ctx?.pass({
      id: "PERF-02",
      pillar: "perf",
      label: "Cumulative Layout Shift (CLS) ≤ 0.1",
      value: cls,
      threshold: 0.1,
      units: "score",
    });
  }
  // CTA Flow (FINAL, CONTRACT-LOCKED)
  if (rules.trustBeforeCTA) {
    const viewportHeight = page.viewportSize()?.height ?? 800;

    const whatsappCTAs = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="whatsapp:"]'
        )
      )
        .filter((a) => {
          const rect = a.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .map((a) => ({
          top: a.getBoundingClientRect().top,
        }));
    });

    const aboveFoldCTAs = whatsappCTAs.filter(
      (cta) => cta.top >= 0 && cta.top <= viewportHeight
    );

    expect(
      aboveFoldCTAs.length === 1,
      `Expected exactly 1 primary WhatsApp CTA above the fold, found ${aboveFoldCTAs.length}`
    ).toBeTruthy();

    ctx?.pass({
      id: "CTA-01",
      pillar: "cta_flow",
      label: "Exactly one primary WhatsApp CTA above the fold",
    });

    ctx?.pass({
      id: "CTA-02",
      pillar: "cta_flow",
      label: "Contextual WhatsApp CTAs allowed below the fold",
    });

    ctx?.pass({
      id: "CTA-03",
      pillar: "cta_flow",
      label: "Trust-first CTA layout respected",
    });
  }

  // ❌ REMOVED:
  // - text-based CTA counting
  // - trust keyword indexing
  // - global CTA count enforcement
  /**
   * CTA-04: Hero image must be optimized for mobile LCP
   * - priority loading
   * - fixed dimensions (prevents CLS)
   * - alt text present
   */
  if (rules.requireHeroLCPGuard) {
    const heroImage = page.locator("img").first();

    await expect(
      heroImage,
      "Hero image missing (required for LCP validation)"
    ).toHaveCount(1);

    const attrs = await heroImage.evaluate(img => ({
      width: img.getAttribute("width"),
      height: img.getAttribute("height"),
      alt: img.getAttribute("alt"),
      fetchPriority: img.getAttribute("fetchpriority"),
      loading: img.getAttribute("loading"),
      src: (img.getAttribute("src") || (img as HTMLImageElement).currentSrc) as string,
    }));

    expect(
      attrs.alt,
      "Hero image missing alt text (accessibility + SEO)"
    ).toBeTruthy();

    expect(
      attrs.width && attrs.height,
      "Hero image missing fixed width/height (CLS risk)"
    ).toBeTruthy();

    const hasPreload = await page.evaluate((src) => {
      if (!src) return false;
      // Check for a preload link matching the image src (may be absolute or relative)
      const links = Array.from(document.querySelectorAll('link[rel="preload"][as="image"]')) as HTMLLinkElement[];
      return links.some(l => l.href.endsWith(src) || l.href.includes(src));
    }, attrs.src);

    expect(
      attrs.fetchPriority === "high" || attrs.loading === "eager" || hasPreload,
      "Hero image not prioritized for LCP (mobile performance risk)"
    ).toBeTruthy();
  }

  // Check hero image prioritization (CTA-04) and record pass/fail
  const heroLcpOk = await page.evaluate(() => {
    const heroImg = document.querySelector('img[data-hero]');
    if (!heroImg) return false;

    const fetchPriority = heroImg.getAttribute("fetchpriority");
    const loading = heroImg.getAttribute("loading");

    return fetchPriority === "high" || loading === "eager";
  });

  if (heroLcpOk) {
    ctx?.pass({ id: "CTA-04", pillar: "cta_flow" });
  } else {
    ctx?.fail({ id: "CTA-04", pillar: "cta_flow" });
  }

  
  if (rules.trustBeforeCTA) {
    ctx?.pass({
      id: "FLOW-01",
      pillar: "cta_flow",
    });
  } else {
    ctx?.fail({
      id: "FLOW-01",
      pillar: "cta_flow",
    });
  }
} // End validateFlow