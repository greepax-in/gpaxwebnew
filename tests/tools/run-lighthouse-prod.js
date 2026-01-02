

import { spawn } from "node:child_process";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import fs from "node:fs";

/* --------------------------------------------------
   Target URL (homepage by default, page-level optional)
-------------------------------------------------- */

const BASE_URL =
  process.env.LH_URL?.trim() || "http://localhost:3000";

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

/* --------------------------------------------------
   Resolve Chrome path (Windows-safe)
-------------------------------------------------- */

function resolveChromePath() {
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  throw new Error(
    "Chrome not found. Install Google Chrome or update resolveChromePath()."
  );
}

const CHROME_PATH = resolveChromePath();

let server;

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
    console.log("▶ Starting production server...");
    server = spawn("npm", ["run", "start:prod:test"], {
      stdio: "inherit",
      shell: true,
    });

    const ready = await waitForServer(BASE_URL);
    if (!ready) {
      throw new Error("Production server did not start");
    }

    console.log(`▶ Running Lighthouse on ${BASE_URL}`);

    const chrome = await launch({
      chromePath: CHROME_PATH,
      chromeFlags: ["--headless", "--disable-gpu"],
    });

    const result = await lighthouse(BASE_URL, {
      port: chrome.port,
      onlyCategories: ["performance", "seo"],
      output: "json",
      logLevel: "error",
    });

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
      }`
    );

    await chrome.kill();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    if (server) server.kill();
  }
})();
