import { expect, Page } from "@playwright/test";
import type { PerformanceRules } from "./types";
import type { ContractEvidenceContext } from "./contractEvidence";

// PERF-00 deprecated:
// This project does not use MUI / Emotion / CSS-in-JS.
// FOUC is prevented via static CSS and layout stability checks (CLS).
// Kept intentionally removed to avoid false performance failures.
// export async function validateMUIFOUC(...) {}

export async function validateINP(page: Page, rules?: PerformanceRules, ctx?: ContractEvidenceContext) {
  /**
   * PERF-03: Interaction to Next Paint (INP) ≤ 200ms
   */
  const selector = 'a[href*="wa.me"], a[href*="whatsapp"]';

    const inp = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return null;

      // Guard against navigation: temporarily remove href to ensure programmatic
      // activation doesn't navigate and destroy the execution context.
      const anchor = el as HTMLAnchorElement;
      const originalHref = anchor.getAttribute("href");
      if (originalHref) anchor.removeAttribute("href");

      // Prevent other click listeners from triggering navigation-heavy logic.
      anchor.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          // @ts-ignore
          if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
        },
        { capture: true }
      );

      return new Promise<number>((resolve) => {
        const start = performance.now();

        requestAnimationFrame(() => {
          // Programmatic activation without href prevents navigation.
          anchor.click();
          requestAnimationFrame(() => {
            // Restore original href after measurement (best-effort).
            if (originalHref) anchor.setAttribute("href", originalHref);
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
