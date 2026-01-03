// FILE: src/scripts/checkBundleSize.ts

import fs from "fs";
import path from "path";
import zlib from "zlib";
import { writeFileSync, mkdirSync } from "fs";

const NEXT_BUILD_DIR = ".next/static/chunks";
const NEXT_MANIFEST =
  ".next/server/app/page_client-reference-manifest.json";
const BASELINE_PATH = "contracts/bundle-baseline.json";
const EVIDENCE_OUT = "reports/bundle.contract.evidence.json";

const BUDGETS = {
  homepage: {
    maxGzipKb: 180,
    regressionKb: 10,
  },
};

function gzipSize(filePath: string): number {
  const raw = fs.readFileSync(filePath);
  return zlib.gzipSync(raw).length;
}

function kb(bytes: number) {
  return Math.round(bytes / 1024);
}

/**
 * Resolve ONLY the JS chunks actually referenced by the homepage (/app/page.tsx)
 * using Next.js App Router manifest.
 */
function getHomepageChunks(): string[] {
  const manifestPath = path.resolve(NEXT_MANIFEST);

  // Fully static homepage: no client manifest is expected
  if (!fs.existsSync(manifestPath)) {
    console.log(
      "ℹ️ Homepage is fully static (no client-reference manifest). JS execution assumed minimal."
    );
    return [];
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  // Homepage route key is always "app/page"
  const homepage = manifest["app/page"];

  if (!homepage || !homepage.chunks) {
    console.log(
      "ℹ️ Homepage has no client chunks. JS execution assumed minimal."
    );
    return [];
  }

  return homepage.chunks
    .filter((f: string) => f.endsWith(".js"))
    .map((f: string) => path.join(".next", f));
}

function writeEvidence(
  result: "PASS" | "FAIL",
  value: number,
  threshold: number,
  evidence?: any
) {
  const out = "reports/homepage.contract.evidence.json";
  mkdirSync(path.dirname(out), { recursive: true });

  let existing: any[] = [];
  if (fs.existsSync(out)) {
    try {
      existing = JSON.parse(fs.readFileSync(out, "utf-8"));
    } catch {}
  }

  existing = existing.filter(e => e.id !== "BUNDLE-01");

  existing.push({
    id: "BUNDLE-01",
    pillar: "performance",
    label: "Homepage JS bundle size within budget (gzip)",
    result,
    value,
    threshold,
    units: "KB",
    evidence,
  });

  writeFileSync(out, JSON.stringify(existing, null, 2));
}

(function run() {
  if (!fs.existsSync(NEXT_BUILD_DIR)) {
    console.error("? .next build not found. Run `npm run build` first.");
    process.exit(1);
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    console.error(
      `? Baseline not found at ${BASELINE_PATH}. Create it from a known-good build.`
    );
    process.exit(2);
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8"));
  const files = getHomepageChunks();

  const totalGzip = files.reduce((sum, f) => sum + gzipSize(f), 0);
  const totalKb = kb(totalGzip);

  const baseKb = baseline.homepage?.gzipKb ?? 0;
  const budget = BUDGETS.homepage;

  console.log(`?? Homepage JS (gzip): ${totalKb} KB`);
  console.log(`?? Baseline: ${baseKb} KB`);

  let result: "PASS" | "FAIL" = "PASS";
  let reason = "within budget";

  if (totalKb > budget.maxGzipKb) {
    console.error(
      `? Bundle exceeds hard limit: ${totalKb}KB > ${budget.maxGzipKb}KB`
    );
    result = "FAIL";
    reason = "exceeds hard limit";
  }

  if (totalKb - baseKb > budget.regressionKb) {
    console.error(
      `? Bundle regression: +${totalKb - baseKb}KB (allowed +${budget.regressionKb}KB)`
    );
    result = "FAIL";
    reason = "regression beyond allowance";
  }

  fs.mkdirSync(path.dirname(EVIDENCE_OUT), { recursive: true });
  fs.writeFileSync(
    EVIDENCE_OUT,
    JSON.stringify(
      [
        {
          id: "BUNDLE-01",
          result,
          value: totalKb,
          threshold: budget.maxGzipKb,
          units: "KB (gzip)",
          evidence: {
            baselineKb: baseKb,
            regressionKb: totalKb - baseKb,
            reason,
            chunks: files.map(f => path.basename(f)),
          },
          at: new Date().toISOString(),
        },
      ],
      null,
      2
    )
  );

  if (result === "FAIL") {
    process.exit(1);
  }

  console.log("? Bundle size within contract limits");
})();
