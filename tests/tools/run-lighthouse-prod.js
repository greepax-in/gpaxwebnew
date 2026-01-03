
const { spawn } = require("child_process");
const lighthouse = require("lighthouse").default;
const { launch } = require("chrome-launcher");
const fs = require("fs");
const path = require("path");

/* --------------------------------------------------
   Target URL (homepage by default, page-level optional)
-------------------------------------------------- */

const BASE_URL =
  process.env.LH_URL?.trim() || "http://localhost:3000";

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
    // LH_URL defaults to http://localhost:3000
    // Override via env if needed (CI, VPS, alternate ports).

    const ready = await waitForServer(BASE_URL);
    if (!ready) {
      throw new Error("Production server did not start");
    }

    const mode = process.argv[2] === "mobile" ? "mobile" : "desktop";
    console.log(`▶ Running Lighthouse (${mode}) on ${BASE_URL}`);

    chromeInstance = await launch({
      chromeFlags: ["--headless", "--disable-gpu"],
    });

    const lighthouseConfig =
      mode === "mobile"
        ? {
            port: chromeInstance.port,
            onlyCategories: ["performance", "seo"],
            formFactor: "mobile",
            screenEmulation: {
              mobile: true,
              width: 375,
              height: 667,
              deviceScaleFactor: 2,
              disabled: false,
            },
            throttlingMethod: "simulate",
            output: "json",
            logLevel: "error",
          }
        : {
            port: chromeInstance.port,
            onlyCategories: ["performance", "seo"],
            output: "json",
            logLevel: "error",
          };

    const result = await lighthouse(BASE_URL, lighthouseConfig);

    const url = new URL(BASE_URL);
    const serverMeta = {
      workspace: WORKSPACE,
      url: BASE_URL,
      host: url.hostname,
      port: url.port || (url.protocol === "https:" ? "443" : "80"),
      mode,
      collectedAt: new Date().toISOString(),
    };

    /* --------------------------------------------------
       Persist Lighthouse JSON (Phase-2.2 ingestion)
    -------------------------------------------------- */

    const reportsDir = path.resolve("reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(reportsDir, `lighthouse.home.${mode}.json`),
      JSON.stringify(
        {
          meta: serverMeta,
          lhr: result.lhr,
        },
        null,
        2
      )
    );

    const { performance, seo } = result.lhr.categories;
    const audits = result.lhr.audits;

    /* --------------------------------------------------
       Core Web Vitals extraction
    -------------------------------------------------- */

    const lcp = audits["largest-contentful-paint"]?.numericValue ?? null;
    const cls = audits["cumulative-layout-shift"]?.numericValue ?? null;
    const inp =
      audits["interaction-to-next-paint"]?.numericValue ??
      audits["total-blocking-time"]?.numericValue ??
      null;
    const fcp = audits["first-contentful-paint"]?.numericValue ?? null;
    const ttfb =
      audits["server-response-time"]?.numericValue ?? null;

    /* --------------------------------------------------
       Performance score (informational only)
    -------------------------------------------------- */

    if (performance.score === null) {
      console.warn(
        "⚠ Lighthouse performance score is null (acceptable locally)"
      );
    } else {
      console.log(
        `ℹ Lighthouse performance score (informational): ${performance.score}`
      );
    }

    /* --------------------------------------------------
       Core Web Vitals enforcement (HARD GATES)
    -------------------------------------------------- */

    if (lcp !== null && lcp > LCP_THRESHOLD) {
      throw new Error(`❌ LCP too slow: ${Math.round(lcp)}ms`);
    }

    if (cls !== null && cls > CLS_THRESHOLD) {
      throw new Error(`❌ CLS too high: ${cls}`);
    }

    if (inp !== null && inp > INP_THRESHOLD) {
      throw new Error(`❌ INP/TBT too slow: ${Math.round(inp)}ms`);
    }

    if (seo.score < SEO_THRESHOLD) {
      throw new Error(`❌ SEO score ${seo.score} < ${SEO_THRESHOLD}`);
    }

    console.log(
      `✅ Lighthouse passed
SEO: ${seo.score}
Perf score: ${performance.score ?? "n/a"}
CWV → LCP=${lcp ? Math.round(lcp) + "ms" : "n/a"}, CLS=${
        cls ?? "n/a"
      }, INP=${inp ? Math.round(inp) + "ms" : "n/a"}, FCP=${
        fcp ? Math.round(fcp) + "ms" : "n/a"
      }, TTFB=${ttfb ? Math.round(ttfb) + "ms" : "n/a"}`
    );

    process.exit(0);
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
