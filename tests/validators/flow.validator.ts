// FILE: tests/validators/flow.validator.ts
/**
 * FLOW validator (Evidence-only, ABI v1.1 compliant)
 * --------------------------------------------------
 * This validator MUST:
 * - observe and emit EvidenceEntry via ctx.emit()
 *
 * This validator MUST NOT:
 * - decide pass/fail
 * - compare thresholds
 * - throw due to contract-rule violations
 * - use expect() for contract enforcement
 *
 * Notes:
 * - Evidence IDs and severities MUST match contracts/evidence/evidence.contract.json
 * - CTA-* evidence belongs to the "flow" pillar (not a separate pillar)
 * - This file emits:
 *   FLOW-01, FLOW-02,
 *   CTA-01, CTA-02,
 *   PERF-RUNTIME-01 (CLS),
 *   PERF-RUNTIME-02 (LCP)
 */

import type { Page } from "@playwright/test";
import type { FlowRules } from "./types";
import type { ContractEvidenceContext } from "./contractEvidence";

/* --------------------------------------------
   Helpers (observation-only)
--------------------------------------------- */

const WHATSAPP_SELECTOR =
  'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="whatsapp:"]';

function safeText(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.replace(/\s+/g, " ").trim();
}

function containsForbiddenTerms(text: string, forbidden: string[]): string[] {
  const hay = text.toLowerCase();
  return forbidden.filter((t) => hay.includes(t.toLowerCase()));
}

/**
 * Compute DOM index of an element by selector (first match).
 * Returns -1 if not found.
 */
async function getDomIndex(page: Page, selector: string): Promise<number> {
  return page.evaluate((sel) => {
    const target = document.querySelector(sel);
    if (!target) return -1;

    const all = Array.from(document.body.querySelectorAll("*"));
    return all.findIndex((el) => el === target);
  }, selector);
}

/**
 * Compute DOM index of the first H1.
 * Returns -1 if not found.
 */
async function getFirstH1DomIndex(page: Page): Promise<number> {
  return page.evaluate(() => {
    const h1 = document.querySelector("h1");
    if (!h1) return -1;
    const all = Array.from(document.body.querySelectorAll("*"));
    return all.findIndex((el) => el === h1);
  });
}

/**
 * Find a reasonable "trust signals" anchor in DOM (best-effort).
 * Returns { selectorUsed, domIndex }.
 * domIndex = -1 if none found.
 */
async function findTrustAnchor(page: Page): Promise<{ selectorUsed: string; domIndex: number }> {
  const candidates = [
    '[data-section="trust"]',
    '[data-trust="true"]',
    'section[id*="trust"]',
    'section[class*="trust"]',
    'section:has(h2:text("Trust"))', // may not be supported in all engines; kept as fallback
  ];

  for (const sel of candidates) {
    try {
      const idx = await getDomIndex(page, sel);
      if (idx >= 0) return { selectorUsed: sel, domIndex: idx };
    } catch {
      // ignore selector errors (observation-only)
    }
  }

  // fallback heuristic: find first element whose text suggests trust/quality/capability
  const heuristic = await page.evaluate(() => {
    const needles = ["manufacturing", "capacity", "quality", "certification", "bulk", "trusted", "since"];
    const all = Array.from(document.body.querySelectorAll<HTMLElement>("section, div"));
    const hit = all.find((el) => {
      const t = (el.innerText || "").toLowerCase();
      return needles.some((n) => t.includes(n));
    });
    if (!hit) return { selectorUsed: "heuristic:text", domIndex: -1 };
    const nodes = Array.from(document.body.querySelectorAll("*"));
    return { selectorUsed: "heuristic:text", domIndex: nodes.findIndex((n) => n === hit) };
  });

  return heuristic;
}

/**
 * Collect LCP via PerformanceObserver (best-effort).
 * Returns { lcpMs, elementTag } (0/null if not captured).
 */
async function collectLCP(page: Page): Promise<{ lcpMs: number; elementTag: string | null }> {
  return page.evaluate(() => {
    return new Promise<{ lcpMs: number; elementTag: string | null }>((resolve) => {
      let lcpValue = 0;
      let tag: string | null = null;

      try {
        const obs = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1] as any;
          if (last) {
            lcpValue = last.startTime || lcpValue;
            tag = last.element?.tagName ?? tag;
          }
        });

        obs.observe({ type: "largest-contentful-paint", buffered: true });

        setTimeout(() => {
          obs.disconnect();
          resolve({ lcpMs: Math.round(lcpValue), elementTag: tag });
        }, 3000);
      } catch {
        resolve({ lcpMs: 0, elementTag: null });
      }
    });
  });
}

/**
 * Collect CLS via PerformanceObserver (best-effort).
 * Returns numeric CLS (0 if not captured).
 */
async function collectCLS(page: Page): Promise<number> {
  return page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let clsValue = 0;

      try {
        const obs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) clsValue += entry.value;
          }
        });

        obs.observe({ type: "layout-shift", buffered: true });

        setTimeout(() => {
          obs.disconnect();
          resolve(Number(clsValue.toFixed(3)));
        }, 3000);
      } catch {
        resolve(0);
      }
    });
  });
}

/* --------------------------------------------
   Main validator
--------------------------------------------- */

export async function validateFlow(
  page: Page,
  rules: FlowRules,
  ctx?: ContractEvidenceContext
): Promise<void> {
  // If no ctx provided, validator remains no-op evidence-wise (still does observation work safely).
  // This preserves call-sites that might not pass ctx yet.
  const emit = ctx?.emit.bind(ctx);

  /* =========================
     FLOW-01 — Hero identity present (H1 exists)
     ========================= */

  if (rules.heroFirst) {
    const h1Count = await page.locator("h1").count();
    const h1DomIndex = await getFirstH1DomIndex(page);

    emit?.({
      id: "FLOW-01",
      pillar: "flow",
      severity: "error",
      observed: {
        h1Count,
        h1DomIndex
      },
      expected: {
        min_h1: 1,
        note: "H1 must exist in initial DOM (text-first identity)."
      },
      source: "dom",
      location: "h1"
    });
  }

  /* =========================
     CTA detection (shared)
     ========================= */

  // Best-effort: do NOT throw if selector doesn't appear.
  let ctaCountVisible = 0;
  let aboveFoldCTAcount = 0;
  let viewportHeight = page.viewportSize()?.height ?? 800;

  // DOM index for first WhatsApp CTA (for flow ordering)
  let ctaDomIndex = -1;

  try {
    // wait briefly for hydration/SSR anchors; if not found, proceed with empty evidence
    await page.waitForSelector(WHATSAPP_SELECTOR, { state: "attached", timeout: 1500 });
  } catch {
    // ignore
  }

  try {
    const ctaInfo = await page.evaluate((sel) => {
      const els = Array.from(document.querySelectorAll<HTMLAnchorElement>(sel));
      const nodes = Array.from(document.body.querySelectorAll("*"));

      const visible = els
        .map((a) => {
          const rect = a.getBoundingClientRect();
          return {
            href: a.getAttribute("href") || "",
            text: a.textContent || "",
            top: rect.top,
            width: rect.width,
            height: rect.height
          };
        })
        .filter((x) => x.width > 0 && x.height > 0);

      const first = els[0] ?? null;
      const domIndex = first ? nodes.findIndex((n) => n === first) : -1;

      return { visible, domIndex };
    }, WHATSAPP_SELECTOR);

    ctaDomIndex = ctaInfo.domIndex;
    ctaCountVisible = ctaInfo.visible.length;
    aboveFoldCTAcount = ctaInfo.visible.filter((x) => x.top >= 0 && x.top <= viewportHeight).length;

    /* =========================
       CTA-02 — CTA language non-transactional
       ========================= */
    if (rules.trustBeforeCTA) {
      const forbidden = ["buy", "order", "price", "discount"];
      const found = ctaInfo.visible
        .flatMap((x) => containsForbiddenTerms(safeText(x.text), forbidden))
        .filter(Boolean);

      emit?.({
        id: "CTA-02",
        pillar: "flow",
        severity: "error",
        observed: {
          visibleCtaCount: ctaCountVisible,
          forbiddenTermsFound: Array.from(new Set(found))
        },
        expected: {
          forbidden_terms: forbidden
        },
        source: "dom",
        location: `CTA text (${WHATSAPP_SELECTOR})`
      });
    }
  } catch {
    // If evaluation fails, emit minimal CTA-02 evidence when enabled (no throw)
    if (rules.trustBeforeCTA) {
      emit?.({
        id: "CTA-02",
        pillar: "flow",
        severity: "error",
        observed: {
          visibleCtaCount: 0,
          forbiddenTermsFound: [],
          error: "cta_evaluation_failed"
        },
        expected: {
          forbidden_terms: ["buy", "order", "price", "discount"]
        },
        source: "dom",
        location: `CTA text (${WHATSAPP_SELECTOR})`
      });
    }
  }

  /* =========================
     CTA-01 — Exactly one primary WhatsApp CTA above the fold
     ========================= */
  if (rules.trustBeforeCTA) {
    emit?.({
      id: "CTA-01",
      pillar: "flow",
      severity: "error",
      observed: {
        aboveFoldCTAcount,
        totalVisibleCtaCount: ctaCountVisible,
        viewportHeight
      },
      expected: {
        exactly: 1,
        note: "Primary WhatsApp CTA must be visible above the fold."
      },
      source: "dom",
      location: `Viewport vs CTA (${WHATSAPP_SELECTOR})`
    });
  }

  /* =========================
     FLOW-02 — Trust signals present before or with CTA
     (best-effort DOM ordering)
     ========================= */
  if (rules.trustBeforeCTA) {
    const trust = await findTrustAnchor(page);
    const h1DomIndex = await getFirstH1DomIndex(page);

    emit?.({
      id: "FLOW-02",
      pillar: "flow",
      severity: "error",
      observed: {
        trustSelector: trust.selectorUsed,
        trustDomIndex: trust.domIndex,
        ctaDomIndex,
        h1DomIndex
      },
      expected: {
        trust_required: true,
        trust_before_or_equal_cta: true
      },
      source: "dom",
      location: `${trust.selectorUsed} vs first WhatsApp CTA`
    });
  }

  /* =========================
     PERF-01 — CLS observation (runtime)
     Contract marks this as error severity.
     ========================= */
  if (rules.requireCLSBudget) {
    const cls = await collectCLS(page);

    emit?.({
      id: "PERF-RUNTIME-01",
      pillar: "performance",
      severity: "error",
      observed: { cls },
      expected: { max: 0.1 },
      source: "runtime",
      location: "CLS (PerformanceObserver)"
    });
  }

  /* =========================
     PERF-02 — LCP observation (runtime)
     Contract marks this as warn severity (observation/policy).
     ========================= */
  if (rules.requireLCPObservation?.enabled) {
    try {
      const lcp = await page.evaluate(() => {
        return new Promise<number | null>((resolve) => {
          let lcpValue: number | null = null;

          try {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const last = entries[entries.length - 1] as any;
              if (last) lcpValue = Math.round(last.startTime || 0);
            });

            observer.observe({ type: "largest-contentful-paint", buffered: true });

            // Give browser a short window to flush buffered entries
            setTimeout(() => {
              try {
                observer.disconnect();
              } catch {}
              resolve(lcpValue);
            }, 300);
          } catch {
            resolve(null);
          }
        });
      });

      ctx?.emit({
        id: "PERF-RUNTIME-02",
        pillar: "performance",
        severity: "warn",
        observed: {
          lcpMs: lcp,
          measured: lcp !== null
        },
        expected: {
          policy: "text-first-allowed"
        },
        source: "runtime",
        location: "largest-contentful-paint"
      });
    } catch {
      // observation-only; ignore errors
    }
  }

  // End: no throws, no expects, evidence-only.
}
