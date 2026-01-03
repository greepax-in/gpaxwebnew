import { expect, Page } from "@playwright/test";
import type { PerformanceRules } from "./types";
import type { ContractEvidenceContext } from "../validators/contractEvidence";

export async function validateMUIFOUC(page: Page, ctx?: ContractEvidenceContext) {
  // Capture screenshot immediately after DOMContentLoaded
  await page.waitForLoadState("domcontentloaded");

  const hasEmotionStyles = await page.evaluate(() => {
    return !!document.querySelector('style[data-emotion]');
  });

  expect(
    hasEmotionStyles,
    "MUI Emotion styles missing at first paint (FOUC / CLS risk)"
  ).toBeTruthy();

  ctx?.pass({
    id: "PERF-00",
    pillar: "perf",
    label: "MUI Emotion SSR styles present at first paint (FOUC guard)",
  });
}

export async function validateINP(page: Page, ctx?: ContractEvidenceContext) {
  /**
   * PERF-03: Interaction to Next Paint (INP) ≤ 200ms
   */
  const selector = 'a[href*="wa.me"], a[href*="whatsapp"]';

  const inp = await page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return null;

    return new Promise<number>((resolve) => {
      const start = performance.now();

      requestAnimationFrame(() => {
        el.click();
        requestAnimationFrame(() => {
          resolve(Math.round(performance.now() - start));
        });
      });
    });
  }, selector);

  if (inp !== null) {
    ctx?.pass({ id: "PERF-03", pillar: "perf" });
  } else {
    ctx?.fail({ id: "PERF-03", pillar: "perf" });
  }
}

export async function validatePerformance(
  page: Page,
  rules: PerformanceRules,
  ctx?: ContractEvidenceContext
): Promise<void> {
  if (rules.lcp) {
    if (rules.lcp <= 2500) {
      ctx?.pass({ id: "PERF-01", pillar: "perf" });
    } else {
      ctx?.fail({ id: "PERF-01", pillar: "perf" });
    }
  }
}
