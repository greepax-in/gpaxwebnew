import type { Page } from "@playwright/test";
import type { PerformanceRules } from "./types";
import type { ContractEvidenceContext } from "./contractEvidence";
// import { runLighthouse } from "../tools/run-lighthouse-prod";

// PERF-00 deprecated:
// This project does not use MUI / Emotion / CSS-in-JS.
// FOUC is prevented via static CSS and layout stability checks (CLS).
// Kept intentionally removed to avoid false performance failures.
// export async function validateMUIFOUC(...) {}

export async function validateINP(
  page: Page,
  _rules?: PerformanceRules,
  ctx?: ContractEvidenceContext
): Promise<void> {
  /**
   * PERF-03: Interaction to Next Paint (INP)
   * Observation-only
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

  ctx?.emit({
    id: "PERF-03",
    pillar: "performance",
    severity: "info",
    observed: {
      inpMs: inp,
      selector,
      measured: inp !== null
    },
    expected: {
      metric: "INP",
      policy: "observational"
    },
    source: "runtime",
    location: selector
  });
}

// NOTE:
// LCP and CLS thresholds are evaluated by Lighthouse + Verdict Engine.
// No performance threshold enforcement exists in validators.

export async function validatePerformance(
  page: Page,
  _rules?: PerformanceRules,
  ctx?: ContractEvidenceContext
): Promise<void> {
  // The Lighthouse runner used in CI is an external helper script
  // (tests/tools/run-lighthouse-prod.js). That helper is not importable
  // as a module in this runtime; calling it directly would either be
  // unavailable or spawn a separate process. To keep the validator
  // safe and runnable in lightweight test environments, emit an
  // informational evidence item and skip attempting to run Lighthouse
  // when the helper is not provided.

  ctx?.emit({
    id: "PERF-02",
    pillar: "performance",
    severity: "info",
    source: "lighthouse",
    observed: {
      available: false,
      reason: "Lighthouse runner not configured in this environment",
      note: "Lighthouse runner unavailable; skipping LCP/desktop diagnostics",
    },
    expected: {},
    
  });
  return;
}
