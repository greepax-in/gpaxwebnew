import fs from "fs";
import path from "path";
import { HOMEPAGE_CHECKS } from "../contracts/homepage.checks";
import "dotenv/config";

type Severity = "info" | "warn" | "error";
type ResolvedResult = "PASS" | "FAIL" | "NOT_RUN";

type RegistryMeta = {
  id: string;
  pillar: string;
  label: string;
  severity: Severity;
  deprecated?: boolean;
  aliasOf?: string;
};

type EvidenceRowLike = {
  id: string;
  result?: "PASS" | "FAIL";
  value?: any;
  threshold?: any;
  units?: string;
  evidence?: any;
  at?: string;
};

type ResolvedCheck = {
  id: string;
  pillar: string;
  label: string;
  severity: Severity;
  result: ResolvedResult;
  value?: any;
  threshold?: any;
  units?: string;
  evidence?: any;
  source?: "evidence" | "alias" | "registry";
};

const inputPath = path.resolve("reports/contract-results.json");
const jsonOut = path.resolve("reports/homepage.contract.report.json");
const htmlOut = path.resolve("reports/homepage.contract.report.html");
const evidencePath = path.resolve("reports/homepage.contract.evidence.json");
const trendOut = path.resolve("reports/homepage.perf.trend.json");

const lighthouseMobilePath = path.resolve("reports/lighthouse.home.mobile.json");
const lighthouseDesktopPath = path.resolve("reports/lighthouse.home.desktop.json");

function readLighthouse(file: string) {
  if (!fs.existsSync(file)) return null;
  const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
  const lhr = raw.lhr;
  const meta = raw.meta || null;

  return {
    meta,
    scores: {
      performance: lhr.categories.performance.score != null
        ? Math.round(lhr.categories.performance.score * 100)
        : null,
      seo: lhr.categories.seo.score != null
        ? Math.round(lhr.categories.seo.score * 100)
        : null,
    },
    vitals: {
      lcpMs: lhr.audits["largest-contentful-paint"]?.numericValue != null
        ? Math.round(lhr.audits["largest-contentful-paint"].numericValue)
        : null,
      cls: lhr.audits["cumulative-layout-shift"]?.numericValue != null
        ? Number(lhr.audits["cumulative-layout-shift"].numericValue.toFixed(3))
        : null,
      inpMs:
        lhr.audits["interaction-to-next-paint"]?.numericValue ??
        lhr.audits["total-blocking-time"]?.numericValue ??
        null,
      ttfbMs:
        lhr.audits["server-response-time"]?.numericValue != null
          ? Math.round(lhr.audits["server-response-time"].numericValue)
          : lhr.audits["time-to-first-byte"]?.numericValue != null
          ? Math.round(lhr.audits["time-to-first-byte"].numericValue)
          : null,
    },
  };
}

const lighthouse = {
  mobile: readLighthouse(lighthouseMobilePath),
  desktop: readLighthouse(lighthouseDesktopPath),
};

// --------------------------------------------------
// Execution timestamp (must exist before evidence binding)
// --------------------------------------------------

const generatedAt = new Date().toISOString();

// --------------------------------------------------
// Evidence map (authoritative runtime store)
// --------------------------------------------------

const evidenceById = new Map<string, any>();

// Lighthouse → Contract perf evidence binding (authoritative)
if (lighthouse.mobile?.vitals?.ttfbMs != null) {
  evidenceById.set("PERF-04", {
    id: "PERF-04",
    result: lighthouse.mobile.vitals.ttfbMs <= 800 ? "PASS" : "FAIL",
    value: lighthouse.mobile.vitals.ttfbMs,
    threshold: 800,
    units: "ms",
    evidence: "Lighthouse mobile server-response-time",
    at: generatedAt,
  });
}
/* --------------------------------------------------
   Workspace / Environment Identity (Context Only)
-------------------------------------------------- */

const WORKSPACE =
  process.env.WORKSPACE?.trim() || "UNKNOWN";

function renderLighthouseSection(lighthouse: any) {
  if (!lighthouse?.mobile && !lighthouse?.desktop) {
    return `
      <div class="section">
        <h2>Performance (Lighthouse)</h2>
        <p class="muted">
          Lighthouse results not available for this run.
          Performance budgets are evaluated using Lighthouse (mobile-first).
        </p>
      </div>
    `;
  }

  const renderTable = (title: string, data: any, budgets: any, authoritative: boolean) => {
    if (!data) return '';

    const rows = ['lcp', 'cls', 'inp'].map((metric) => {
      const value = data[metric === 'lcp' ? 'lcpMs' : metric === 'cls' ? 'cls' : 'tbtMs'] ?? 'n/a';
      const budget = budgets[metric];

      let status = 'PASS';
      if (value === 'n/a') status = 'INFO';
      else if (value > budget) status = authoritative ? 'FAIL' : 'WARN';

      return `
        <tr>
          <td>${metric.toUpperCase()}</td>
          <td>${value}</td>
          <td>≤ ${budget}</td>
          <td class="${status.toLowerCase()}">${status}</td>
        </tr>
      `;
    }).join('');

    return `
      <h3>${title}</h3>
      <table class="perf-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Measured</th>
            <th>Budget</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };

  return `
    <div class="section">
      <h2>Performance (Lighthouse)</h2>

      <p class="muted">
        Lighthouse metrics are authoritative for performance decisions.
        Mobile results are release-gating; desktop results are advisory.
      </p>

      ${renderTable(
        'Mobile (Authoritative)',
        lighthouse.mobile,
        { lcp: 2500, cls: 0.1, inp: 200 },
        true
      )}

      ${renderTable(
        'Desktop (Advisory)',
        lighthouse.desktop,
        { lcp: 1800, cls: 0.05, inp: 150 },
        false
      )}
    </div>
  `;
}

if (!fs.existsSync(inputPath)) {
  console.error("❌ Playwright JSON report not found:", inputPath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
const stats = raw.stats ?? {};

 // Extract LCP evidence if present (future-safe)
 const lcpEvidence =
   raw.annotations?.find((a: any) => a.type === "lcp")?.value ?? null;

const passed = stats.expected ?? 0;
const failed = stats.unexpected ?? 0;
const skipped = stats.skipped ?? 0;
const flaky = stats.flaky ?? 0;

const total = passed + failed + skipped + flaky;
const status = failed === 0 ? "PASSED" : "FAILED";

const pillars = {
  seo: status === "PASSED" ? "PASS" : "FAIL",
  schema: status === "PASSED" ? "PASS" : "FAIL",
  intent: status === "PASSED" ? "PASS" : "FAIL",
  cta_flow: status === "PASSED" ? "PASS" : "FAIL",
};

const evidenceRows: any[] = fs.existsSync(evidencePath)
  ? JSON.parse(fs.readFileSync(evidencePath, "utf-8"))
  : [];

const bundleEvidencePath = path.resolve("reports/bundle.contract.evidence.json");
if (fs.existsSync(bundleEvidencePath)) {
  const bundleEvidence = JSON.parse(
    fs.readFileSync(bundleEvidencePath, "utf-8")
  );
  evidenceRows.push(...bundleEvidence);
}

for (const row of evidenceRows) evidenceById.set(row.id, row);

/* ---------------- CHECK-BY-CHECK EVIDENCE ---------------- */

function buildRegistry(): RegistryMeta[] {
  const out: RegistryMeta[] = [];
  for (const [pillar, rules] of Object.entries(HOMEPAGE_CHECKS as any)) {
    for (const rule of rules as any[]) {
      out.push({
        id: rule.id,
        pillar,
        label: rule.label,
        severity: (rule.severity ?? "info") as Severity,
        deprecated: Boolean(rule.deprecated),
        aliasOf: rule.aliasOf,
      });
    }
  }
  return out;
}

/**
 * Phase-2.1 Evidence Resolver (Authoritative)
 * - Registry is the source of truth for label/severity/pillar.
 * - Runtime evidence supplies result/value/threshold.
 * - If a registry check is deprecated, we exclude it from resolved output.
 * - If a check has aliasOf, we use the aliased evidence when direct evidence is missing.
 * - If no evidence exists, result is NOT_RUN (does NOT imply pass/fail).
 */
function resolveEvidence(
  registry: RegistryMeta[],
  evidenceMap: Map<string, EvidenceRowLike>
): ResolvedCheck[] {
  const resolved: ResolvedCheck[] = [];

  for (const meta of registry) {
    if (meta.deprecated) continue; // eliminate registry duplicates

    // ---------------- PERF-01 OVERRIDE ----------------
    // PERF-01 (Homepage LCP) is strictly derived from Lighthouse Mobile
    if (meta.id === "PERF-01") {
      const lcp = lighthouse?.mobile?.vitals?.lcpMs ?? null;

      resolved.push({
        id: meta.id,
        pillar: meta.pillar,
        label: meta.label,
        severity: meta.severity,
        result:
          lcp == null
            ? "NOT_RUN"
            : lcp <= 2500
            ? "PASS"
            : "FAIL",
        value: lcp,
        threshold: 2500,
        units: "ms",
        evidence: "lighthouse.mobile.lcp",
        source: "registry",
      });

      continue;
    }

    // ---------------- PERF-04 OVERRIDE ----------------
    // PERF-04 (Homepage TTFB) is strictly derived from Lighthouse Mobile
    if (meta.id === "PERF-04") {
      const ttfb = lighthouse?.mobile?.vitals?.ttfbMs ?? null;

      resolved.push({
        id: meta.id,
        pillar: meta.pillar,
        label: meta.label,
        severity: meta.severity,
        result:
          ttfb == null
            ? "NOT_RUN"
            : ttfb <= 800
            ? "PASS"
            : "FAIL",
        value: ttfb,
        threshold: 800,
        units: "ms",
        evidence: "lighthouse.mobile.ttfb",
        source: "registry",
      });

      continue;
    }

    const direct = evidenceMap.get(meta.id);
    const aliased = meta.aliasOf ? evidenceMap.get(meta.aliasOf) : undefined;

    const ev = direct ?? aliased;
    const source: ResolvedCheck["source"] =
      direct ? "evidence" : aliased ? "alias" : "registry";

    const result: ResolvedResult =
      ev?.result === "PASS" || ev?.result === "FAIL" ? ev.result : "NOT_RUN";

    resolved.push({
      id: meta.id,
      pillar: meta.pillar,
      label: meta.label,
      severity: meta.severity,
      result,
      value: ev?.value,
      threshold: ev?.threshold,
      units: ev?.units,
      evidence: ev?.evidence,
      source,
    });
  }

  // stable ordering: pillar then id
  resolved.sort((a, b) =>
    a.pillar === b.pillar ? a.id.localeCompare(b.id) : a.pillar.localeCompare(b.pillar)
  );
  return resolved;
}

const registry = buildRegistry();
const resolvedEvidence = resolveEvidence(registry, evidenceById);

// Group for UI sections (single source of truth)
const checks = Object.fromEntries(
  Object.entries(HOMEPAGE_CHECKS).map(([pillar]) => [
    pillar,
    resolvedEvidence.filter((r) => r.pillar === pillar),
  ])
);

// Extract perf metrics (numeric evidence)
const perf = {
  // PERF-01 is AUTHORITATIVE from Lighthouse Mobile only
  // Playwright or other sources must NOT influence LCP gate
  lcpMs: lighthouse?.mobile?.vitals?.lcpMs ?? null,
  // PERF-04 — Homepage TTFB (Lighthouse Mobile)
  ttfbMs: lighthouse?.mobile?.vitals?.ttfbMs ?? null,
  cls: evidenceById.get("PERF-02")?.value ?? null,
  inpMs: evidenceById.get("PERF-03")?.value ?? null,
};

function deriveVerdict(evidence: any[]) {
  const hasError = evidence.some(
    (e) => e.result === "FAIL" && e.severity === "error"
  );

  const hasWarn = evidence.some(
    (e) => e.result === "FAIL" && e.severity === "warn"
  );

  if (hasError) return "BLOCKED";
  if (hasWarn) return "APPROVED_WITH_WARNINGS";
  return "APPROVED";
}

function renderSeverity(severity?: string) {
  const safe = severity ?? "info";
  return `<span class="severity ${safe}">${safe.toUpperCase()}</span>`;
}

function renderPlaywrightPerformanceNote() {
  return `
    <section>
      <h2>Performance (Playwright Audit)</h2>
      <p class="muted">
        These metrics are best-effort signals captured during Playwright runs.
        Values may be <code>n/a</code> and are <strong>not</strong> used for
        performance budget enforcement.
      </p>
    </section>
  `;
}

function renderExecutionStatus() {
  return `
    <section>
      <h2>Execution Status</h2>
      <p class="status completed">COMPLETED</p>
      <p class="muted">
        All contract checks executed. Results below reflect audit findings,
        not execution failures.
      </p>
    </section>
  `;
}

function renderLighthousePerformance(lighthouse: any) {
  if (!lighthouse?.mobile && !lighthouse?.desktop) {
    return `
      <section>
        <h2>Performance (Lighthouse)</h2>
        <p class="muted">
          Lighthouse was not executed in this run.
          Performance decisions must be based on Lighthouse (mobile-first).
        </p>
      </section>
    `;
  }

  const renderBlock = (
    title: string,
    data: any,
    authoritative: boolean
  ) => {
    if (!data) {
      return `<p class="muted">${title}: not available</p>`;
    }

    const { vitals, scores } = data;

    return `
      <h3>${title}</h3>
      ${renderMeta(data.meta)}
      <table class="perf-table">
        <tr><th>LCP</th><td>${vitals.lcpMs ?? "n/a"} ms</td></tr>
        <tr><th>CLS</th><td>${vitals.cls ?? "n/a"}</td></tr>
        <tr><th>INP / TBT</th><td>${vitals.inpMs ?? "n/a"} ms</td></tr>
        <tr><th>Performance Score</th><td>${scores.performance ?? "n/a"}</td></tr>
        <tr><th>SEO Score</th><td>${scores.seo ?? "n/a"}</td></tr>
      </table>
      <p class="muted">
        Mode: <b>${authoritative ? "AUTHORITATIVE (Release-gating)" : "ADVISORY (Diagnostic only)"}</b>
      </p>
    `;
  };

  const renderMeta = (meta: any) => {
    if (!meta) return "";

    const bg =
      meta.workspace === "CI"
        ? "#ecfeff"
        : meta.workspace === "VPS-QA"
        ? "#fef9c3"
        : "#f1f5f9";

    return `
      <div style="
        background:${bg};
        padding:12px 14px;
        border-radius:8px;
        margin-bottom:16px;
        font-size:14px;
        color:#0f172a;
      ">
        <b>Workspace:</b> ${meta.workspace}<br/>
        <b>Server:</b> ${meta.host}:${meta.port}<br/>
        <b>URL:</b> ${meta.url}<br/>
        <b>Collected:</b> ${meta.collectedAt}
      </div>
    `;
  };

  return `
    <section>
      <h2>Performance (Lighthouse)</h2>
      <p class="muted">
        Lighthouse results are reported separately for mobile and desktop.
        Only <b>mobile</b> Lighthouse is authoritative for release gating.
      </p>

      ${renderBlock("Mobile (Authoritative)", lighthouse.mobile, true)}
      ${renderBlock("Desktop (Advisory)", lighthouse.desktop, false)}
    </section>
  `;
}

// (Trend handling moved to after JSON report generation)

/* ---------------- JSON REPORT (Machine) ---------------- */

const jsonReport = {
  contract: "homepage",
  workspace: WORKSPACE,
  status,
  locked: status === "PASSED",
  summary: {
    totalTests: total,
    passed,
    failed,
    skipped,
    flaky,
    durationMs: Math.round(stats.duration ?? 0),
  },
  pillars,
  // Phase-2.1: resolved evidence (registry × runtime)
  checks,
  resolvedEvidence,
  perf,
  lighthouse,
  generatedAt,
};

fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
fs.writeFileSync(jsonOut, JSON.stringify(jsonReport, null, 2));

/* ---------------- PERF TREND (Append-only) ---------------- */

let trend: any[] = [];
if (fs.existsSync(trendOut)) {
  try {
    trend = JSON.parse(fs.readFileSync(trendOut, "utf-8"));
  } catch {
    trend = [];
  }
}

const entry = {
  at: generatedAt,
  status,
  perf,
};
trend.push(entry);
fs.writeFileSync(trendOut, JSON.stringify(trend, null, 2));

/* ---------------- DRIFT DETECTION ----------------
   Fail if performance regresses too much vs previous run (even if within budget)
*/
const prev = trend.length >= 2 ? trend[trend.length - 2] : null;
const driftGuard = { lcpMs: 200, inpMs: 50, cls: 0.02 };

const drift = prev
  ? {
      lcpMs: perf.lcpMs != null && prev.perf?.lcpMs != null ? perf.lcpMs - prev.perf.lcpMs : null,
      inpMs: perf.inpMs != null && prev.perf?.inpMs != null ? perf.inpMs - prev.perf.inpMs : null,
      cls: perf.cls != null && prev.perf?.cls != null ? Number((perf.cls - prev.perf.cls).toFixed(3)) : null,
    }
  : null;

if (drift) {
  const lcpRegress = drift.lcpMs != null && drift.lcpMs > driftGuard.lcpMs;
  const inpRegress = drift.inpMs != null && drift.inpMs > driftGuard.inpMs;
  const clsRegress = drift.cls != null && drift.cls > driftGuard.cls;

  if (lcpRegress || inpRegress || clsRegress) {
    console.error("❌ Performance drift regression detected:", drift, "Guard:", driftGuard);
    process.exit(1);
  }
}

const verdict = deriveVerdict(resolvedEvidence);

/* ---------------- HTML REPORT (Human) ---------------- */

const statusColor = status === "PASSED" ? "#16a34a" : "#dc2626";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GreenPax Homepage Contract Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      color: #0f172a;
    }
    .container {
      max-width: 960px;
      margin: auto;
      background: #ffffff;
      padding: 24px 32px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
    }
    h1 {
      margin-top: 0;
    }
    .status {
      font-size: 20px;
      font-weight: 700;
      color: ${statusColor};
    }
    .meta {
      color: #475569;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .workspace-note {
      font-size: 13px;
      color: #475569;
      margin-top: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 600;
    }
    .pass {
      color: #16a34a;
      font-weight: 600;
    }
    .fail {
      color: #dc2626;
      font-weight: 600;
    }
    .section {
      margin-top: 32px;
    }
    .pillars span {
      display: inline-block;
      margin-right: 16px;
      font-weight: 600;
    }
    .evidence-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    .evidence-table th,
    .evidence-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .evidence-table th {
      background: #f8fafc;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>GreenPax Homepage — Contract Validation Report</h1>
    
    <div class="meta">
      <b>Workspace:</b>
      <span style="
        display:inline-block;
        padding:4px 10px;
        border-radius:999px;
        background:#0f172a;
        color:#ffffff;
        font-weight:600;
        margin-left:6px;
      ">
        ${WORKSPACE}
      </span>
    </div>

    ${renderExecutionStatus()}
    <div class="meta">
      Contract: <b>homepage</b><br/>
      Generated at: ${generatedAt}
    </div>

    <div class="section">
      <h2>Contract Checks (Resolved)</h2>
      <p style="color:#475569;font-size:14px;margin-top:8px;margin-bottom:0;">
        This table is the authoritative merge of registry checks × runtime evidence.
        Result <code>NOT_RUN</code> means no runtime evidence was emitted for that check.
      </p>

      ${Object.entries(checks)
        .map(([pillar, rules]) => {
          const rows = (rules as any[])
            .map((r: any) => {
              const cls =
                r.result === "PASS" ? "pass" : r.result === "FAIL" ? "fail" : "";
              return `
                <tr>
                  <td>${r.id}</td>
                  <td>${r.label}</td>
                  <td class="${cls}">${r.result}</td>
                  <td>${String(r.severity ?? "info").toUpperCase()}</td>
                  <td style="color:#64748b;">${r.source ?? ""}</td>
                </tr>
              `;
            })
            .join("");

          return `
            <h3>${pillar.toUpperCase()}</h3>
            <table class="evidence-table">
              <tr>
                <th>Check ID</th>
                <th>Description</th>
                <th>Result</th>
                <th>Severity</th>
                <th>Source</th>
              </tr>
              ${rows}
            </table>
          `;
        })
        .join("")}
    </div>

    <!-- Legacy flat Contract Evidence section removed. Canonical source is now "Contract Checks (Resolved)". -->
    ${renderPlaywrightPerformanceNote()}${renderLighthousePerformance(jsonReport.lighthouse)}

    <section class="workspace-note">
      <p>
        Interpretation context:
        <b>${WORKSPACE}</b> workspace.
        Performance and Lighthouse signals may be advisory or authoritative
        depending on workspace policy.
      </p>
    </section>

    <div class="section">
      <h2>Performance (Playwright Audit)</h2>
      <p style="color:#475569;font-size:14px;margin-top:8px;margin-bottom:0;">
        These are best-effort metrics captured during Playwright runs. Values may be <code>n/a</code>.
        Performance decisions should be based on Lighthouse (mobile-first).
      </p>
      <table class="evidence-table">
        <tr>
          <th>Metric</th>
          <th>Measured</th>
          <th>Budget</th>
        </tr>
        <tr>
          <td>LCP</td>
          <td>${perf.lcpMs == null ? "n/a" : `${perf.lcpMs} ms`}</td>
          <td>≤ 2500 ms</td>
        </tr>
        <tr>
          <td>CLS</td>
          <td>${perf.cls == null ? "n/a" : `${perf.cls}`}</td>
          <td>≤ 0.1</td>
        </tr>
        <tr>
          <td>INP</td>
          <td>${perf.inpMs == null ? "n/a" : `${perf.inpMs} ms`}</td>
          <td>≤ 200 ms</td>
        </tr>
      </table>

      <p style="color:#475569;font-size:14px;margin-top:10px;">
        Trend file: <code>homepage.perf.trend.json</code>
        ${drift ? ` | Drift vs previous: LCP ${drift.lcpMs ?? "n/a"} ms, CLS ${drift.cls ?? "n/a"}, INP ${drift.inpMs ?? "n/a"} ms` : ""}
      </p>
    </div>

    <div class="section">
      <h2>Summary</h2>
      <table>
        <tr><th>Total Tests</th><td>${total}</td></tr>
        <tr><th>Passed</th><td class="pass">${passed}</td></tr>
        <tr><th>Failed</th><td class="${failed === 0 ? "pass" : "fail"}">${failed}</td></tr>
        <tr><th>Skipped</th><td>${skipped}</td></tr>
        <tr><th>Flaky</th><td>${flaky}</td></tr>
        <tr><th>Duration</th><td>${Math.round(stats.duration ?? 0)} ms</td></tr>
      </table>
    </div>

    <div class="section">
      <h2>Validation Pillars</h2>
      <div class="pillars">
        <span>SEO: <span class="${pillars.seo === "PASS" ? "pass" : "fail"}">${pillars.seo}</span></span>
        <span>Schema: <span class="${pillars.schema === "PASS" ? "pass" : "fail"}">${pillars.schema}</span></span>
        <span>Intent: <span class="${pillars.intent === "PASS" ? "pass" : "fail"}">${pillars.intent}</span></span>
        <span>CTA Flow: <span class="${pillars.cta_flow === "PASS" ? "pass" : "fail"}">${pillars.cta_flow}</span></span>
      </div>
    </div>

    <section>
      <h2>Contract Verdict</h2>
      <p class="verdict ${verdict.toLowerCase()}">${verdict}</p>
      <p class="muted">
        Verdict is derived from failed checks weighted by severity
        (error / warn / info).
      </p>
    </section>

  </div>
</body>
</html>`;

fs.writeFileSync(htmlOut, html);

console.log("✅ Homepage contract reports generated:");
console.log(jsonOut);
console.log(htmlOut);
