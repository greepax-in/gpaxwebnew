
const lighthouse = require("lighthouse").default;
const { launch } = require("chrome-launcher");
const fs = require("fs");
const path = require("path");

function firstDetailsItem(details) {
  if (!details || typeof details !== "object") return null;
  const items = details.items;
  return Array.isArray(items) ? items[0] ?? null : null;
}
/* --------------------------------------------------
   Debug artifact writer (NON-CONTRACTUAL)
-------------------------------------------------- */

function writeDebugArtifact(mode, name, data) {
  const baseDir = path.resolve(
    process.cwd(),
    "reports",
    "lighthouse",
    mode
  );

  fs.mkdirSync(baseDir, { recursive: true });

  fs.writeFileSync(
    path.join(baseDir, name),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}
/* --------------------------------------------------
   Lighthouse HTML writers (NON-CONTRACTUAL)
-------------------------------------------------- */

const LIGHTHOUSE_ROOT = path.resolve(
  process.cwd(),
  "reports",
  "lighthouse"
);

function writeRawLighthouseHtml(mode, html) {
  if (!html || typeof html !== "string") return;

  const outPath = path.join(
    LIGHTHOUSE_ROOT,
    mode,
    "lighthouse.html"
  );

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
}

function writeComparisonShell({ generatedAt }) {
  const outPath = path.join(
    LIGHTHOUSE_ROOT,
    "lighthouse-report.html"
  );

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Lighthouse Comparison Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <style>
    body {
      margin: 24px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: #fff;
      color: #111;
    }
    h1, h2 {
      margin-top: 32px;
    }
    section {
      margin-top: 24px;
    }
    iframe {
      width: 100%;
      height: 90vh;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #fff;
    }
    .meta {
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>Lighthouse Comparison Report</h1>
  <p class="meta">Generated at ${generatedAt}</p>

  <section>
    <h2>Mobile Lighthouse Report</h2>
    <iframe src="./mobile/lighthouse.html"></iframe>
  </section>

  <section>
    <h2>Desktop Lighthouse Report</h2>
    <iframe src="./desktop/lighthouse.html"></iframe>
  </section>
</body>
</html>`;

  fs.mkdirSync(LIGHTHOUSE_ROOT, { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
}
const fetch = globalThis.fetch;

if (typeof fetch !== "function") {
  throw new Error(
    "Global fetch is not available in this Node runtime. Install 'node-fetch' or run on Node >=18."
  );
}

// NOTE:
// Lighthouse is a TOOL, not a validator.
// It writes evidence directly to the evidence report file.


const EVIDENCE_FILE =
  process.env.EVIDENCE_FILE ||
  path.resolve(process.cwd(), "reports/homepage.contract.evidence.json");

function emitEvidence(entry) {
  let report = { page: BASE_URL, evidence: [] };

  if (fs.existsSync(EVIDENCE_FILE)) {
    try {
      report = JSON.parse(fs.readFileSync(EVIDENCE_FILE, "utf8"));
    } catch {
      report = { page: BASE_URL, evidence: [] };
    }
  }

  report.evidence.push({
    ...entry,
    timestamp: new Date().toISOString(),
  });

  fs.mkdirSync(path.dirname(EVIDENCE_FILE), { recursive: true });
  fs.writeFileSync(EVIDENCE_FILE, JSON.stringify(report, null, 2));
}

/* --------------------------------------------------
   Long-task attribution helpers (LCP window)
-------------------------------------------------- */

function ms(n) {
  return typeof n === "number" && Number.isFinite(n) ? Math.round(n) : null;
}

function clampStr(s, max = 140) {
  if (!s || typeof s !== "string") return null;
  return s.length > max ? s.slice(0, max - 1) + "..." : s;
}

function normalizeUrl(u) {
  if (!u || typeof u !== "string") return null;
  try {
    const url = new URL(u);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return u;
  }
}

function extractLongTasks(lhr, lcpMs) {
  const audit = lhr?.audits?.["long-tasks"];
  const items = Array.isArray(audit?.details?.items)
    ? audit.details.items
    : [];

  if (!Number.isFinite(lcpMs)) {
    return {
      topBeforeLcp: [],
      totals: { countBeforeLcp: 0, sumDurationMsBeforeLcp: 0, maxTaskMsBeforeLcp: 0 },
    };
  }

  const beforeOrOverlappingLcp = items
    .map((t) => {
      // Lighthouse long-tasks startTime is already in milliseconds (ms).
      const startMs =
        typeof t.startTime === "number" ? t.startTime : null;
      const durMs = typeof t.duration === "number" ? t.duration : null;
      const endMs =
        startMs !== null && durMs !== null ? startMs + durMs : null;

      const overlapsLcp =
        startMs !== null && endMs !== null ? startMs <= lcpMs : false;

      const attributions = Array.isArray(t.attribution) ? t.attribution : [];
      const topAttr = attributions
        .map((a) => ({
          url: normalizeUrl(a.url || a.attributableToURL || a.name),
          total: ms(a.total),
          name: clampStr(a.name),
        }))
        .filter((a) => a.url || a.name)
        .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))[0];

      return overlapsLcp && typeof durMs === "number"
        ? {
            startMs: ms(startMs),
            durationMs: ms(durMs),
            endMs: ms(endMs),
            name: clampStr(t.name),
            attribution: topAttr || null,
          }
        : null;
    })
    .filter(Boolean);

  const totals = beforeOrOverlappingLcp.reduce(
    (acc, t) => {
      acc.countBeforeLcp += 1;
      acc.sumDurationMsBeforeLcp += t.durationMs;
      acc.maxTaskMsBeforeLcp = Math.max(acc.maxTaskMsBeforeLcp, t.durationMs);
      return acc;
    },
    { countBeforeLcp: 0, sumDurationMsBeforeLcp: 0, maxTaskMsBeforeLcp: 0 }
  );

  return {
    topBeforeLcp: beforeOrOverlappingLcp
      .sort((a, b) => b.durationMs - a.durationMs)
      .slice(0, 10),
    totals,
  };
}

const RUNS = Math.max(3, Number(process.env.LH_RUNS ?? 5));
const WARMUP_DELAY_MS = Math.max(0, Number(process.env.LH_WARMUP_MS ?? 3000));
const STRICT_MOBILE_EMISSION =
  process.env.LH_STRICT_MOBILE_EMISSION !== "0";

/* --------------------------------------------------
   Target URL (homepage by default, page-level optional)
-------------------------------------------------- */

/* --------------------------------------------------
   Execution mode (mobile | desktop)
-------------------------------------------------- */

const mode = process.argv[2];

if (mode !== "mobile" && mode !== "desktop") {
  throw new Error(
    `Invalid Lighthouse mode "${mode}". Expected "mobile" or "desktop".`
  );
}

const BASE_URL = process.env.LH_URL?.trim();
if (!BASE_URL) {
  throw new Error("LH_URL is required for Lighthouse runs (external server mode).");
}

const WORKSPACE = process.env.WORKSPACE || "UNKNOWN";
/* --------------------------------------------------
   Thresholds (LOCKED by governance)
-------------------------------------------------- */

const PERF_THRESHOLD = Number(process.env.LH_PERF_THRESHOLD ?? 0.9); // informational only
const SEO_THRESHOLD = Number(process.env.LH_SEO_THRESHOLD ?? 0.9);

// Core Web Vitals thresholds
const LCP_THRESHOLD = 2500; // ms
const CLS_THRESHOLD = 0.1;  // unitless
const INP_THRESHOLD = 200;  // ms
const FCP_THRESHOLD = 1800; // ms (advisory only)

// Use Chromium via chrome-launcher (VPS / CI safe)
// chrome-launcher will auto-resolve or download Chromium as needed

// NOTE:
// Lighthouse runner does NOT own server lifecycle.
// Server is expected to be started externally via:
//   - `next build`
//   - `next start` (or equivalent production runner)
//
// This script ONLY:
//   - waits for the server to be reachable
//   - runs Lighthouse against LH_URL
//   - never assumes responsibility for ports or process startup
//
// In local dev, CI, or VPS:
//   - Port conflicts must be resolved by the caller
//   - LH_URL must point to an already-running server
//
// Historical note:
// Earlier versions spawned `next start` internally, but this caused
// port conflicts (EADDRINUSE) and non-deterministic shutdown behavior,
// especially on Windows. This is intentionally avoided.

let server; // legacy placeholder (not used when server is externally managed)
let chromeInstance;

/* --------------------------------------------------
   Deterministic server shutdown (Windows-safe)
-------------------------------------------------- */

async function stopServer(proc) {
  if (!proc || proc.killed) return;

  try {
    proc.kill("SIGTERM");
  } catch {}

  // Windows / stubborn process safety net
  await new Promise((r) => setTimeout(r, 1500));

  try {
    if (!proc.killed) {
      proc.kill("SIGKILL");
    }
  } catch {}
}

/* --------------------------------------------------
   Wait for server to be ready
-------------------------------------------------- */

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

/* --------------------------------------------------
   Main
-------------------------------------------------- */

(async () => {
  try {
    // NOTE:
    // Lighthouse is a TOOL.
    // It MUST NOT use ContractEvidenceContext or validator semantics.
    // Evidence is written directly via emitEvidence().
    // IMPORTANT:
    // Server startup is handled OUTSIDE this script.
    // Expected flow:
    //   1. `next build`
    //   2. `next start` (or platform equivalent)
    //   3. Run this Lighthouse script
    //
    // This avoids:
    //   - double-binding ports
    //   - orphaned processes
    //   - Windows SIGTERM/SIGKILL edge cases
    //
    // LH_URL must be provided externally (CI, VPS, alternate ports).
    // Override via env if needed (CI, VPS, alternate ports).

    const ready = await waitForServer(BASE_URL);
    if (!ready) {
      throw new Error("Production server did not start or was unreachable at LH_URL");
    }
    console.log(`Running Lighthouse (${mode}) on ${BASE_URL} (runs=${RUNS})`);
    // Trace reliability toggle:
    // Some Lighthouse trace pipelines can be flaky in headless mode on certain platforms.
    // Set LH_HEADLESS=0 to run headful once for diagnosis (frame_sequence / trace errors).
    const HEADLESS = process.env.LH_HEADLESS !== "0";
    chromeInstance = await launch({
      chromePath: process.env.LH_CHROME_PATH,
      chromeFlags: [
        ...(HEADLESS ? ["--headless=new"] : []),
        "--no-first-run",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
        "--disable-dev-shm-usage",
      ],
    });

    const runs = [];
    const discarded = [];
    const diagnostics = [];

    for (let i = 0; i < RUNS; i++) {
      /** @type {import("lighthouse").Flags} */
      const flags = {
        port: chromeInstance.port,
        output: ["json", "html"],   // ✅ REQUIRED
        logLevel: "error",
      };

      /** @type {import("lighthouse/types/config").default} */
      const config =
        mode === "mobile"
          ? {
              extends: "lighthouse:default",
              settings: {
                onlyCategories: ["performance", "seo"],
                formFactor: "mobile",
                screenEmulation: {
                  mobile: true,
                  width: 360,
                  height: 740,
                  deviceScaleFactor: 2,
                },
                throttlingMethod: "simulate",
                throttling: {
                  rttMs: 150,
                  throughputKbps: 1600,
                  cpuSlowdownMultiplier: 4,
                },
              },
            }
          : {
              extends: "lighthouse:default",
              settings: {
                onlyCategories: ["performance", "seo"],
                formFactor: "desktop",
                throttlingMethod: "simulate",
                throttling: {
                  rttMs: 40,
                  throughputKbps: 10240,
                  cpuSlowdownMultiplier: 1,
                },
                screenEmulation: {
                  mobile: false,
                  width: 1366,
                  height: 768,
                  deviceScaleFactor: 1,
                },
              },
            };

      const run = await lighthouse(BASE_URL, flags, config);
      const audit = run?.lhr?.audits;
      const htmlReport = run?.report?.[1]; // index 1 = html

      if (typeof htmlReport === "string") {
        const htmlPath = path.resolve(
          process.cwd(),
          "reports",
          "lighthouse",
          mode,
          "lighthouse.html"
        );

        fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
        fs.writeFileSync(htmlPath, htmlReport, "utf8");
      }
      const metrics = firstDetailsItem(audit?.metrics?.details);
      const lcpAudit = audit?.["largest-contentful-paint"];
      const hasRuntimeError = Boolean(run?.lhr?.runtimeError);
      const hasTrace = Boolean(run?.lhr?.audits?.["trace-of-tab"]?.details);
      const lcpValue =
        typeof lcpAudit?.numericValue === "number" ? lcpAudit.numericValue : null;
      // Integrity rules:
      // - Desktop: LCP numeric value required
      // - Mobile: LCP numeric value MAY be absent (text-only LCP by design)
      // Integrity rules (CONTRACT-LOCKED):
      // - Desktop: numeric LCP REQUIRED
      // - Mobile: numeric LCP OPTIONAL (text-only hero allowed)
      const invalid =
        lcpAudit?.scoreDisplayMode === "error" ||
        hasRuntimeError ||
        (mode === "desktop" && typeof lcpValue !== "number");

      if (mode === "mobile" && (!metrics || !hasTrace)) {
        diagnostics.push({
          id: "PERF-LCP-NO-TRACE",
          message:
            "Mobile text-based LCP emitted without trace attribution (expected)",
        });
      }

      if (invalid) {
        discarded.push({
          run: i + 1,
          reason:
            lcpValue == null
              ? "missing LCP"
              : hasRuntimeError
              ? "runtimeError"
              : lcpAudit?.scoreDisplayMode === "error"
              ? "lcp audit error"
              : !metrics
              ? "missing metrics"
              : "missing trace",
        });
        continue;
      }

      runs.push({
        runIndex: i + 1,
        lhr: run.lhr,
        reportHtml: Array.isArray(run.report)
          ? run.report.find(r => typeof r === "string")
          : run.report,
        lcp: lcpValue,
        cls: audit?.["cumulative-layout-shift"]?.numericValue ?? null,
        inp: audit?.["interaction-to-next-paint"]?.numericValue ?? null,
      });
    }

    if (runs.length < Math.ceil(RUNS / 2)) {
      throw new Error(
        `Insufficient valid Lighthouse runs for reliable median (valid=${runs.length}, required=${Math.ceil(
          RUNS / 2
        )}, discarded=${discarded.length})`
      );
    }

    // Median selection (MOBILE-SAFE):
    // - Desktop: median by numeric LCP
    // - Mobile: median by run order when LCP is null
    const sortableRuns =
      mode === "desktop" ? runs.filter((r) => typeof r.lcp === "number") : runs.slice();

    const sorted =
      mode === "desktop"
        ? sortableRuns.slice().sort((a, b) => a.lcp - b.lcp)
        : sortableRuns;

    const medianRun = sorted[Math.floor(sorted.length / 2)] ?? runs[0];

    const result = {
      lhr: medianRun.lhr,
      reportHtml: medianRun.reportHtml,
    };

    const url = new URL(BASE_URL);
    const serverMeta = {
      workspace: WORKSPACE,
      url: BASE_URL,
      host: url.hostname,
      port: url.port || (url.protocol === "https:" ? "443" : "80"),
      mode,
      collectedAt: new Date().toISOString(),
    };

    const { performance, seo } = result.lhr.categories;
    const audits = result.lhr.audits;

    /* --------------------------------------------------
       Lighthouse HTML outputs (NON-CONTRACTUAL)
    -------------------------------------------------- */

    writeRawLighthouseHtml(mode, result.lhr.reportResult);

    /* --------------------------------------------------
       Core Web Vitals extraction
    -------------------------------------------------- */

    const lcpAudit = audits["largest-contentful-paint"];
    const inpAudit = audits["interaction-to-next-paint"];

    const lcp =
      typeof lcpAudit?.numericValue === "number"
        ? lcpAudit.numericValue
        : null;

    /* --------------------------------------------------
       PERF-02 - Largest Contentful Paint (Lighthouse)
       Evidence-only emission
    -------------------------------------------------- */

    const lcpItem = firstDetailsItem(lcpAudit?.details);
    const lcpNodeName = lcpItem?.node?.nodeName ?? null;

    if (mode === "desktop") {
      // Desktop: numeric LCP REQUIRED
      if (typeof lcp === "number") {
        const entry = {
          id: "PERF-02",
          pillar: "performance",
          severity: "warn",
          source: "lighthouse",
          observed: {
            lcpMs: Math.round(lcp),
            elementTag: lcpNodeName,
            mode: "desktop",
          },
          expected: {
            max: LCP_THRESHOLD,
          },
        };

        emitEvidence(entry);
      } else {
        const entry = {
          id: "PERF-02",
          pillar: "performance",
          severity: "warn",
          source: "lighthouse",
          observed: {
            missing: true,
            mode: "desktop",
          },
          expected: {
            max: LCP_THRESHOLD,
          },
        };

        emitEvidence(entry);
      }
    }

    if (mode === "mobile") {
      // Mobile: text-first allowed, BUT timing is still authoritative
      if (typeof lcp === "number") {
        const entry = {
          id: "PERF-02",
          pillar: "performance",
          severity: "warn",
          source: "lighthouse",
          observed: {
            lcpMs: Math.round(lcp),
            elementTag: lcpNodeName,
            mode: "mobile",
          },
          expected: {
            max: LCP_THRESHOLD,
            policy: "text-first-allowed",
          },
        };

        emitEvidence(entry);
      } else {
        // Legitimate NOT_RUN only if Lighthouse truly did not emit LCP
        const entry = {
          id: "PERF-02",
          pillar: "performance",
          severity: "warn",
          source: "lighthouse",
          observed: {
            missing: true,
            mode: "mobile",
            observation_reason: "lcp-not-emitted-by-lighthouse",
          },
          expected: {
            policy: "text-first-allowed",
          },
        };

        emitEvidence(entry);
      }
    }

    // Diagnostic note (non-fatal): mobile pages may emit text-only LCP
    if (mode === "mobile" && lcp === null) {
      console.log(
        "Info: Mobile text-only LCP (numeric value not emitted by Lighthouse)"
      );
    }

    // Phase-aware metrics (from metrics audit)
    const metrics = firstDetailsItem(audits?.metrics?.details) ?? null;
    const lcpLoadStart = metrics?.lcpLoadStart ?? null;
    const lcpLoadEnd = metrics?.lcpLoadEnd ?? null;
    const ttfbMs = metrics?.timeToFirstByte ?? null;
    const renderDelayMs =
      typeof lcp === "number" && typeof lcpLoadEnd === "number"
        ? ms(lcp - lcpLoadEnd)
        : null;
    const resourceLoadDelay =
      typeof lcpLoadStart === "number" && typeof ttfbMs === "number"
        ? ms(lcpLoadStart - ttfbMs)
        : null;
    const resourceLoadTime =
      typeof lcpLoadEnd === "number" && typeof lcpLoadStart === "number"
        ? ms(lcpLoadEnd - lcpLoadStart)
        : null;
    const isRenderDominated =
      typeof renderDelayMs === "number" && typeof lcp === "number"
        ? renderDelayMs > lcp * 0.5
        : null;

    if (isRenderDominated) {
      console.log(
        `Info: render-delay dominates LCP (renderDelay=${renderDelayMs}ms, LCP=${Math.round(lcp)}ms)`
      );
    }

    // Long-task attribution correlated to LCP window
    const longTasks = extractLongTasks(result.lhr, lcp);

    const inp =
      typeof inpAudit?.numericValue === "number"
        ? inpAudit.numericValue
        : null;

    const cls = audits["cumulative-layout-shift"]?.numericValue ?? null;
    const fcp = audits["first-contentful-paint"]?.numericValue ?? null;
    const ttfb = audits["server-response-time"]?.numericValue ?? null;

    /* --------------------------------------------------
       DEBUG ARTIFACTS (NON-CONTRACTUAL)
       These files are for human inspection only.
       They MUST NOT influence verdict logic.
    -------------------------------------------------- */

    writeDebugArtifact(mode, "lhr.json", result.lhr);

    writeDebugArtifact(mode, "metrics.json", {
      lcpMs: typeof lcp === "number" ? Math.round(lcp) : null,
      cls,
      inp,
      fcp,
      ttfb,
      renderDelayMs,
      resourceLoadDelay,
      resourceLoadTime,
      isRenderDominated
    });

    writeDebugArtifact(mode, "long-tasks.json", longTasks);

    writeDebugArtifact(mode, "diagnostics.json", {
      discardedRuns: discarded,
      diagnostics,
      totalRuns: RUNS,
      validRuns: runs.length,
      selectedRunIndex: medianRun.runIndex,
      mode
    });

    /* --------------------------------------------------
       Performance score (informational only)
    -------------------------------------------------- */

    if (performance.score === null) {
      console.warn(
        "Warning: Lighthouse performance score is null (acceptable locally)"
      );
    } else {
      console.log(
        `Info: Lighthouse performance score (informational): ${performance.score}`
      );
    }

    /* --------------------------------------------------
       Core Web Vitals enforcement (HARD GATES)
    -------------------------------------------------- */

    const inpReason =
      inp === null
        ? inpAudit?.scoreDisplayMode || "NOT_TRIGGERED"
        : null;

    if (mode === "mobile" && STRICT_MOBILE_EMISSION) {
      // Mobile LCP contract:
      // - LCP emission is optional (text-only hero)
      // - IF emitted, LCP MUST NOT be an image
      const lcpItem = firstDetailsItem(lcpAudit?.details);
      const lcpNodeName = lcpItem?.node?.nodeName;

      if (
        lcpNodeName &&
        ["IMG", "PICTURE", "SVG"].includes(lcpNodeName)
      ) {
        throw new Error(
          `FAIL: Mobile LCP contract violation: image-based LCP detected (${lcpNodeName})`
        );
      }

      // INP applicability:
      // - INP is REQUIRED only if page has client-side interactivity
      // - Static, zero-JS pages may legitimately emit no INP
      const inpNotApplicable =
        inp === null &&
        (
          inpAudit?.scoreDisplayMode === "notApplicable" ||
          inpAudit?.scoreDisplayMode === "informative" ||
          inpAudit?.scoreDisplayMode === undefined
        );

      if (!inpNotApplicable && inp === null) {
        throw new Error(
          `FAIL: Mobile Lighthouse invalid: INP expected but not emitted (scoreDisplayMode=${inpAudit?.scoreDisplayMode})`
        );
      }
    }

    // NOTE:
    // Threshold comparisons are NOT verdict logic.
    // Lighthouse runner emits facts only.
    // PASS/WARN/FAIL decisions are made by executeVerdictEngine.ts.

    if (seo.score < SEO_THRESHOLD) {
      console.warn(`Warning: SEO score ${seo.score} < ${SEO_THRESHOLD}`);
    }

    console.log(
      `Lighthouse passed
SEO: ${seo.score}
Perf score: ${performance.score ?? "n/a"}
CWV -> LCP=${lcp ? Math.round(lcp) + "ms" : "n/a"}, CLS=${
        cls ?? "n/a"
      }, INP=${inp ? Math.round(inp) + "ms" : "n/a"}, FCP=${
        fcp ? Math.round(fcp) + "ms" : "n/a"
      }, TTFB=${ttfb ? Math.round(ttfb) + "ms" : "n/a"}
LCP renderDelay=${renderDelayMs ?? "n/a"}ms
LongTasks(before LCP): count=${longTasks.totals.countBeforeLcp}, max=${longTasks.totals.maxTaskMsBeforeLcp}ms`
    );

    // Generate comparison shell (idempotent)
    writeComparisonShell({
      generatedAt: new Date().toISOString()
    });

    return;
  } catch (err) {
    console.error(err);
    process.exit(1);
    } finally {
    if (chromeInstance) {
      try {
        await chromeInstance.kill();
      } catch {}
    }

    // No-op if server is externally managed
    await stopServer(server);
  }
})();

// Ensure cleanup on Ctrl+C / hard exits
process.on("SIGINT", async () => {
  // Lighthouse cleanup only; server lifecycle is external
  await stopServer(server);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  // Lighthouse cleanup only; server lifecycle is external
  await stopServer(server);
  process.exit(1);
});

