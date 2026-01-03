import fs from "fs";
import path from "path";
import zlib from "zlib";
import { writeFileSync, mkdirSync } from "fs";

const NEXT_BUILD_DIR = ".next/static/chunks";
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

function getHomepageChunks(): string[] {
  const dir = path.resolve(NEXT_BUILD_DIR);
  return fs
    .readdirSync(dir)
    .filter(
      f =>
        f.endsWith(".js") && !f.includes("webpack") && !f.includes("polyfills")
    )
    .map(f => path.join(dir, f));
}

function kb(bytes: number) {
  return Math.round(bytes / 1024);
}

function writeEvidence(result: "PASS" | "FAIL", value: number, threshold: number, evidence?: any) {
  const out = "reports/homepage.contract.evidence.json";
  mkdirSync(path.dirname(out), { recursive: true });

  let existing: any[] = [];
  if (fs.existsSync(out)) {
    try {
      existing = JSON.parse(fs.readFileSync(out, "utf-8"));
    } catch {}
  }

  // Remove any previous BUNDLE-01 entries
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
    console.error("❌ .next build not found. Run `npm run build` first.");
    process.exit(1);
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    console.error(
      `❌ Baseline not found at ${BASELINE_PATH}. Create it from a known-good build.`
    );
    try {
      const files = getHomepageChunks();
      const totalGzip = files.reduce((sum, f) => sum + gzipSize(f), 0);
      const totalKb = kb(totalGzip);
      const example = { homepage: { gzipKb: totalKb } };
      console.error(
        `Example baseline payload (paste into ${BASELINE_PATH}):\n${JSON.stringify(example, null, 2)}`
      );
    } catch (e) {
      // ignore
    }
    process.exit(2);
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8"));
  const files = getHomepageChunks();

  const totalGzip = files.reduce((sum, f) => sum + gzipSize(f), 0);
  const totalKb = kb(totalGzip);

  const baseKb = baseline.homepage?.gzipKb ?? 0;
  const budget = BUDGETS.homepage;

  console.log(`📦 Homepage JS (gzip): ${totalKb} KB`);
  console.log(`📏 Baseline: ${baseKb} KB`);

  let result: "PASS" | "FAIL" = "PASS";
  let reason = "within budget";

  if (totalKb > budget.maxGzipKb) {
    console.error(
      `❌ Bundle exceeds hard limit: ${totalKb}KB > ${budget.maxGzipKb}KB`
    );
    result = "FAIL";
    reason = "exceeds hard limit";
  }

  if (totalKb - baseKb > budget.regressionKb) {
    console.error(
      `❌ Bundle regression: +${totalKb - baseKb}KB (allowed +${budget.regressionKb}KB)`
    );
    result = "FAIL";
    reason = "regression beyond allowance";
  }

  // Emit contract evidence
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

  console.log("✅ Bundle size within contract limits");
})();
